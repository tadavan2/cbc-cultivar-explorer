#!/usr/bin/env python3
"""Read-only check of existing public Explorer URLs; run against local or live origin."""
import argparse
import json
import re
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

ORIGIN = 'https://cultivars.cbcberry.com'
ROOT = Path(__file__).resolve().parents[1]


class Metadata(HTMLParser):
    def __init__(self, markup):
        super().__init__()
        self.canonicals, self.titles, self.meta = [], [], {}
        self.in_title = False
        self.text, self.links, self.skip = [], [], 0
        self.feed(markup)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('script', 'style'):
            self.skip += 1
        if tag == 'a':
            self.links.append(attrs.get('href'))
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonicals.append(attrs.get('href'))
        if tag == 'meta':
            key = attrs.get('name') or attrs.get('property')
            self.meta.setdefault(key, []).append(attrs.get('content', ''))
        if tag == 'title':
            self.in_title = True
            self.titles.append('')

    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.skip -= 1
        if tag == 'title':
            self.in_title = False

    def handle_data(self, data):
        if not self.skip and not self.in_title:
            self.text.append(data)
        if self.in_title:
            self.titles[-1] += data


def fetch(origin, path, agent):
    request = urllib.request.Request(origin.rstrip('/') + path, headers={'User-Agent': agent})
    try:
        response = urllib.request.urlopen(request, timeout=60)
    except urllib.error.HTTPError as error:
        response = error
    with response:
        return response.status, response.read().decode()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--origin', default='http://127.0.0.1:3011')
    parser.add_argument('--expect-alturas-pilot', action='store_true')
    args = parser.parse_args()
    ids = re.findall(r"id: '([^']+)'", (ROOT / 'data/cultivars.ts').read_text())
    ids = [value for value in ids if value != 'debug']
    paths = ['/'] + ['/' + value for value in ids]
    rows = []
    for agent in ['Mozilla/5.0', 'Googlebot']:
        titles = set()
        for path in paths + ['/?cultivar=castaic', '/alturas?cultivar=castaic']:
            status, body = fetch(args.origin, path, agent)
            meta = Metadata(body)
            target = '/castaic' if path.startswith('/?') else path.split('?')[0].rstrip('/')
            assert status == 200, (path, status)
            assert meta.canonicals == [ORIGIN + target], (path, meta.canonicals)
            assert len(meta.titles) == 1 and meta.titles[0], (path, meta.titles)
            assert meta.meta.get('og:url') == [ORIGIN + target], path
            for key in ['description', 'og:title', 'og:description', 'twitter:title', 'twitter:description']:
                assert len(meta.meta.get(key, [])) == 1 and meta.meta[key][0], (path, key)
            assert meta.meta['og:title'] == meta.titles == meta.meta['twitter:title'], path
            assert meta.meta['description'] == meta.meta['og:description'] == meta.meta['twitter:description'], path
            assert not any('noindex' in value for value in meta.meta.get('robots', [])), path
            if path in paths:
                assert meta.titles[0] not in titles, (path, 'duplicate title')
                titles.add(meta.titles[0])
            if args.expect_alturas_pilot:
                assert set('/' + value for value in ids) <= set(meta.links), (path, 'missing cultivar links')
                if path == '/alturas':
                    content = json.loads((ROOT / 'public/data/cultivars/alturas/content.json').read_text())
                    visible = ' '.join(' '.join(meta.text).split())
                    for fact in content['description']['paragraphs'] + list(content['recommendations'].values()):
                        assert ' '.join(fact.split()) in visible, (path, 'missing initial HTML fact', fact)
            rows.append({'path': path, 'agent': agent, 'status': status, 'title': meta.titles[0], 'canonical': meta.canonicals[0]})
    for path in ['/debug', '/not-a-cultivar']:
        status, body = fetch(args.origin, path, 'Googlebot')
        meta = Metadata(body)
        assert status == 404 and not meta.canonicals, (path, status, meta.canonicals)
        assert any('noindex' in value for value in meta.meta.get('robots', [])), path
    status, body = fetch(args.origin, '/sitemap.xml', 'Googlebot')
    assert status == 200
    urls = [element.text for element in ET.fromstring(body).findall('{*}url/{*}loc')]
    assert sorted(urls) == sorted(ORIGIN + path.rstrip('/') for path in paths), urls
    status, body = fetch(args.origin, '/robots.txt', 'Googlebot')
    assert status == 200 and 'Sitemap: ' + ORIGIN + '/sitemap.xml' in body
    assert 'Allow: /' in body and 'Disallow: /' not in body
    print(json.dumps({'origin': args.origin, 'pages': rows, 'sitemap_urls': urls, 'unknown_paths': '404/noindex', 'result': 'PASS'}, indent=2))


if __name__ == '__main__':
    main()
