import { Cultivar } from '../types/cultivar';

export interface InfoOverlayContent {
  icon: string;
  title: string;
  content: string;
}

export interface InfoOverlayData {
  [key: string]: InfoOverlayContent;
}

// Base info overlay content that applies to all cultivars
export const baseInfoOverlayData: InfoOverlayData = {
  'day-neutral': {
    icon: '☀️',
    title: 'Day-Neutral Strawberries',
    content: `
      <h3>What are Day-Neutral Strawberries?</h3>
      <p>Day-neutral strawberries are varieties that produce fruit continuously throughout the growing season, regardless of day length or temperature. Unlike traditional short-day varieties that produce a single large crop, day-neutrals provide steady harvests from spring through fall.</p>
      
      <h3>Key Characteristics:</h3>
      <ul>
        <li><strong>Continuous Production:</strong> Fruit production is not triggered by day length</li>
        <li><strong>Extended Season:</strong> Harvest from late spring through early fall</li>
        <li><strong>Temperature Sensitive:</strong> True day-neutrals are not temperature sensitive</li>
        <li><strong>Multiple Flushes:</strong> Produce several distinct flowering and fruiting cycles</li>
      </ul>
      
      <h3>Growing Advantages:</h3>
      <ul>
        <li>Consistent fruit supply for fresh market</li>
        <li>Better adaptation to varying climates</li>
        <li>Ideal for greenhouse and tunnel production</li>
        <li>Higher total seasonal yield potential</li>
      </ul>
    `
  },
  'short-day': {
    icon: '🌙',
    title: 'Short-Day Strawberries',
    content: `
      <h3>Understanding Short-Day Strawberries</h3>
      <p>Short-day strawberries are varieties that initiate flower buds when day length decreases, typically in fall. They produce a concentrated harvest period and are ideal for traditional strawberry production systems.</p>
      
      <h3>Key Characteristics:</h3>
      <ul>
        <li><strong>Photoperiod Sensitive:</strong> Flower initiation triggered by shorter days</li>
        <li><strong>Concentrated Harvest:</strong> Major fruiting period in spring</li>
        <li><strong>Cold Requirement:</strong> May need winter chilling for optimal production, though not all short-day varieties require it</li>
        <li><strong>Traditional Variety:</strong> Most common type worldwide</li>
      </ul>
      
      <h3>Production Benefits:</h3>
      <ul>
        <li>High peak yields during harvest season</li>
        <li>Well-suited for processing markets</li>
        <li>Predictable harvest timing</li>
        <li>Lower maintenance during off-season</li>
      </ul>
    `
  },
  'fusarium-resistant': {
    icon: '🛡️',
    title: 'Fusarium Resistance',
    content: `
      <h3>Understanding Fusarium Resistance</h3>
      <p>Fusarium resistance is a critical trait in modern strawberry breeding, protecting plants against one of the most destructive soil-borne diseases affecting strawberry production worldwide.</p>
      
      <h3>About Fusarium Disease:</h3>
      <ul>
        <li><strong>Pathogen:</strong> Fusarium oxysporum f. sp. fragariae</li>
        <li><strong>Symptoms:</strong> Stunting, wilting, crown rot, and plant death</li>
        <li><strong>Soil Persistence:</strong> Can survive in soil for many years</li>
        <li><strong>Economic Impact:</strong> Can cause significant yield losses</li>
      </ul>
      
      <h3>Benefits of Resistant Varieties:</h3>
      <ul>
        <li>Reduced need for soil fumigation</li>
        <li>Lower production costs and risks</li>
        <li>Sustainable disease management</li>
        <li>Ability to grow in infected soils</li>
        <li>Environmental benefits from reduced chemical use</li>
      </ul>
      
      <h3>Resistance Mechanism:</h3>
      <p>Contemporary resistant varieties carry genetic defenses that block pathogen invasion of the plant's vascular system, maintaining healthy growth even in infected soil conditions.</p>
    `
  },
  'macrophomina-resistant': {
    icon: '🛡️',
    title: 'Macrophomina Resistance',
    content: `
      <h3>Macrophomina Resistance</h3>
      <p>Macrophomina resistance protects strawberry plants against Macrophomina phaseolina, a fungal pathogen that causes charcoal rot disease, particularly problematic in warm, dry conditions.</p>
      
      <h3>About Macrophomina Disease:</h3>
      <ul>
        <li><strong>Pathogen:</strong> Macrophomina phaseolina</li>
        <li><strong>Symptoms:</strong> Crown rot, wilting, and black microsclerotia</li>
        <li><strong>Conditions:</strong> Thrives in hot, dry weather</li>
        <li><strong>Impact:</strong> Significant yield losses in affected areas</li>
      </ul>
      
      <h3>Benefits of Resistance:</h3>
      <ul>
        <li>Reliable production in warm climates</li>
        <li>Reduced crop losses during heat stress</li>
        <li>Lower dependency on chemical treatments</li>
        <li>Improved plant longevity</li>
      </ul>
    `
  },
  'high-yields': {
    icon: '📈',
    title: 'High Yield Performance',
    content: `
      <h3>High Yield Strawberry Varieties</h3>
      <p>High-yield strawberry varieties focus on maximizing fruit production per plant and per acre, delivering strong return on investment and long-term profitability for growers.</p>
      
      <h3>Yield Components:</h3>
      <ul>
        <li><strong>Plant Productivity:</strong> More flowers and fruit per plant</li>
        <li><strong>Fruit Size:</strong> Larger average berry size</li>
        <li><strong>Harvest Window:</strong> Extended productive period</li>
        <li><strong>Plant Density:</strong> Optimal plant architecture for high-density planting</li>
      </ul>
      
      <h3>Economic Benefits:</h3>
      <ul>
        <li>Higher revenue per acre</li>
        <li>Better return on investment</li>
        <li>Reduced production costs per unit</li>
        <li>Improved labor efficiency</li>
        <li>Enhanced market competitiveness</li>
      </ul>
      
      <h3>Performance Metrics:</h3>
      <p>Top-producing cultivars achieve remarkable output under ideal conditions, merging reliable harvests with superior fruit quality. These plants showcase streamlined architecture and prolonged harvest periods to optimize both total volume and marketable fruit rates.</p>
    `
  },
  'excellent-flavor': {
    icon: '😋',
    title: 'Excellent Flavor Profile',
    content: `
      <h3>Superior Flavor Characteristics</h3>
      <p>These flavor-focused varieties achieve optimal sugar-acid balance, complex aromatics, and taste profiles that satisfy consumers while earning premium market prices.</p>
      
      <h3>Flavor Components:</h3>
      <ul>
        <li><strong>Sugar Content:</strong> High Brix levels</li>
        <li><strong>Acidity Balance:</strong> Optimal tartness for complexity</li>
        <li><strong>Aromatics:</strong> Rich volatile compounds</li>
        <li><strong>Texture:</strong> Firm yet juicy mouthfeel</li>
      </ul>
      
      <h3>Market Advantages:</h3>
      <ul>
        <li>Premium pricing potential</li>
        <li>Higher consumer satisfaction</li>
        <li>Repeat purchase behavior</li>
        <li>Brand differentiation</li>
        <li>Export market appeal</li>
      </ul>
    `
  },
  'premium-quality': {
    icon: '💎',
    title: 'Premium Quality Standards',
    content: `
      <h3>Premium Quality Attributes</h3>
      <p>These top-tier varieties excel across all quality metrics - appearance, flavor, shelf life, and market performance - earning premium positioning in selective markets.</p>
      
      <h3>Quality Parameters:</h3>
      <ul>
        <li><strong>Appearance:</strong> Uniform size, shape, and color</li>
        <li><strong>Firmness:</strong> Excellent shipping and handling characteristics</li>
        <li><strong>Shelf Life:</strong> Extended freshness for retail</li>
        <li><strong>Consistency:</strong> Reliable quality throughout season</li>
      </ul>
      
      <h3>Market Benefits:</h3>
      <ul>
        <li>Access to premium market segments</li>
        <li>Enhanced brand reputation</li>
        <li>Export opportunities</li>
        <li>Reduced post-harvest losses</li>
        <li>Higher grower returns</li>
      </ul>
    `
  },
  'ultra-early': {
    icon: '🌅',
    title: 'Ultra Early Production',
    content: `
      <h3>Ultra Early Harvest Advantage</h3>
      <p>Ultra early varieties provide the earliest fruit production in the season, capturing premium early market prices and extending the overall harvest period.</p>
      
      <h3>Early Production Benefits:</h3>
      <ul>
        <li><strong>Market Timing:</strong> First to market advantage</li>
        <li><strong>Premium Prices:</strong> Higher early season pricing</li>
        <li><strong>Extended Season:</strong> Longer overall harvest period</li>
        <li><strong>Risk Management:</strong> Earlier cash flow</li>
      </ul>
      
      <h3>Production Advantages:</h3>
      <ul>
        <li>Capture early market premiums</li>
        <li>Spread harvest labor demands</li>
        <li>Reduce weather risk exposure</li>
        <li>Meet early retail programs</li>
      </ul>
    `
  },
  'organic': {
    icon: '🌿',
    title: 'Organic Production Suitability',
    content: `
      <h3>Organic Strawberry Production</h3>
      <p>These naturally hardy varieties feature built-in disease resistance, vigorous plant health, and seamless integration with organic farming practices and certification standards.</p>
      
      <h3>Organic Advantages:</h3>
      <ul>
        <li><strong>Natural Resistance:</strong> Reduced chemical inputs needed</li>
        <li><strong>Plant Vigor:</strong> Strong natural defenses</li>
        <li><strong>Soil Health:</strong> Compatible with organic soil management</li>
        <li><strong>Certification:</strong> Meets organic standards</li>
      </ul>
      
      <h3>Market Benefits:</h3>
      <ul>
        <li>Premium organic pricing</li>
        <li>Growing market demand</li>
        <li>Environmental sustainability</li>
        <li>Certification advantages</li>
        <li>Consumer preference alignment</li>
      </ul>
    `
  },
  'cold-tolerant': {
    icon: '❄️',
    title: 'Cold Tolerance',
    content: `
      <h3>Cold Hardy Strawberry Varieties</h3>
      <p>These weather-tough varieties handle low temperatures, frost events, and severe winter conditions without sacrificing productivity or fruit quality.</p>
      
      <h3>Cold Tolerance Features:</h3>
      <ul>
        <li><strong>Frost Resistance:</strong> Withstand spring frost events</li>
        <li><strong>Winter Hardiness:</strong> Survive harsh winter conditions</li>
        <li><strong>Recovery Ability:</strong> Quick recovery from cold stress</li>
        <li><strong>Extended Season:</strong> Earlier spring and later fall production</li>
      </ul>
      
      <h3>Growing Benefits:</h3>
      <ul>
        <li>Expanded growing regions</li>
        <li>Reduced crop insurance needs</li>
        <li>Lower frost protection costs</li>
        <li>More reliable yields</li>
        <li>Extended harvest windows</li>
      </ul>
    `
  },
  'rugged': {
    icon: '💪',
    title: 'Rugged Performance',
    content: `
      <h3>Rugged Strawberry Varieties</h3>
      <p>These tough performers demonstrate exceptional durability, stress resilience, and dependable results across challenging growing conditions and unpredictable environments.</p>
      
      <h3>Rugged Characteristics:</h3>
      <ul>
        <li><strong>Stress Tolerance:</strong> Handles environmental challenges</li>
        <li><strong>Disease Resistance:</strong> Multiple resistance traits</li>
        <li><strong>Plant Vigor:</strong> Strong, robust growth habit</li>
        <li><strong>Adaptability:</strong> Performs across diverse conditions</li>
      </ul>
      
      <h3>Production Benefits:</h3>
      <ul>
        <li>Reduced input requirements</li>
        <li>Lower crop failure risk</li>
        <li>Consistent performance</li>
        <li>Simplified management</li>
        <li>Reliable returns</li>
      </ul>
    `
  }
};

// Cultivar-specific info overlay data
export const cultivarSpecificInfoData: { [cultivarId: string]: InfoOverlayData } = {
  alturas: {
    'high-yields': {
      icon: '📈',
      title: 'Alturas High Yield Performance',
      content: `
        <h3>Alturas Yield Excellence</h3>
        <p>Alturas achieves outstanding production under ideal conditions, balancing steady output with top-tier fruit quality across the full harvest window.</p>
        
        <h3>Alturas Yield Components:</h3>
        <ul>
          <li><strong>Peak Production:</strong> Exceptional yields</li>
          <li><strong>Fruit Size:</strong> Consistently large berry size</li>
          <li><strong>Extended Harvest:</strong> Continuous production spring through fall</li>
          <li><strong>Plant Efficiency:</strong> Optimized plant architecture for maximum productivity</li>
        </ul>
        
        <h3>Alturas Economic Impact:</h3>
        <ul>
          <li>Premium yield performance in day-neutral category</li>
          <li>Efficient plant structure reduces labor costs</li>
          <li>Consistent fruit quality maintains market premiums</li>
          <li>Extended season maximizes revenue potential</li>
        </ul>
        
        <h3>Grower Success:</h3>
        <p>Alturas's streamlined plant structure and lower maintenance needs allow greater focus on premium fruit development, generating both volume and quality that fuel profitability.</p>
      `
    }
  },
  
  adelanto: {
    'ultra-early': {
      icon: '🌅',
      title: 'Adelanto Ultra Early Production',
      content: `
        <h3>Adelanto Early Season Advantage</h3>
        <p>Adelanto dominates early-season markets, producing premium fruit weeks ahead of standard cultivars while securing peak seasonal pricing.</p>
        
        <h3>Adelanto Early Benefits:</h3>
        <ul>
          <li><strong>First to Market:</strong> Earliest production in day-neutral category</li>
          <li><strong>Premium Pricing:</strong> Capture highest early season prices</li>
          <li><strong>Market Position:</strong> Establish market presence before competition</li>
          <li><strong>Risk Reduction:</strong> Earlier cash flow and reduced weather exposure</li>
        </ul>
        
        <h3>Production Characteristics:</h3>
        <ul>
          <li>Consistent exceptional yields</li>
          <li>Excellent fruit quality from season start</li>
          <li>Reliable early production across climates</li>
          <li>Extended total harvest period</li>
        </ul>
      `
    }
  },
  
  artesia: {
    'organic': {
      icon: '🌿',
      title: 'Artesia Organic Excellence',
      content: `
        <h3>Artesia: The Pinnacle of Organic Production</h3>
        <p>Artesia™ sets the benchmark for organic strawberry cultivation, engineered specifically for sustainable, chemical-free growing systems. This premium day-neutral cultivar thrives where other varieties falter in organic environments.</p>
        
        <h3>Artesia Organic Advantages:</h3>
        <ul>
          <li><strong>Organic Tailored:</strong> Genetics purposefully crafted for chemical-free production systems</li>
          <li><strong>Comprehensive Disease Package:</strong> Robust resistance to all major soil-borne pathogens</li>
          <li><strong>Superior Organic Performance:</strong> Consistently outperforms competitors in organic trials</li>
          <li><strong>Natural Vigor:</strong> Strong plant health reduces need for interventions</li>
        </ul>
        
        <h3>Sustainable Production Benefits:</h3>
        <ul>
          <li>Reduced field losses through natural disease resistance</li>
          <li>Simplified organic disease management protocols</li>
          <li>High marketable yields in certified organic systems</li>
          <li>Enhanced soil health compatibility</li>
          <li>Premium organic market positioning</li>
        </ul>
        
        <h3>Artesia's Organic Promise:</h3>
        <p>From planting to harvest, Artesia™ provides the production, quality, and dependability that characterize thriving organic operations. Discover genetics purpose-built for tomorrow's sustainable strawberry farming.</p>
      `
    }
  }
  
  // Add more cultivar-specific data as needed...
};

// Function to get info data for a specific cultivar
export function getInfoOverlayData(cultivarId?: string): InfoOverlayData {
  const baseData = { ...baseInfoOverlayData };
  
  if (cultivarId && cultivarSpecificInfoData[cultivarId]) {
    // Merge cultivar-specific data with base data
    return { ...baseData, ...cultivarSpecificInfoData[cultivarId] };
  }
  
  return baseData;
}

// Button configuration interface
export interface ButtonConfig {
  id: string;
  className: string;
  icon: string;
  label: string;
}

// Attribute to button mapping
const attributeButtonMap: { [key: string]: Omit<ButtonConfig, 'id'> } = {
  'day-neutral': {
    className: 'premium-button-glass',
    icon: '☀️',
    label: 'DAY-NEUTRAL'
  },
  'short-day': {
    className: 'premium-button-orange-glass',
    icon: '🌙',
    label: 'SHORT-DAY'
  },
  'fusarium resistant': {
    className: 'premium-button-glass',
    icon: '🛡️',
    label: 'FUSARIUM RESISTANT'
  },
  'macrophomina resistant': {
    className: 'premium-button-glass',
    icon: '🛡️',
    label: 'MACROPHOMINA RESISTANT'
  },
  'high yields': {
    className: 'premium-button-glass',
    icon: '📈',
    label: 'HIGH YIELDS'
  },
  'excellent flavor': {
    className: 'premium-button-pink-glass',
    icon: '😋',
    label: 'EXCELLENT FLAVOR'
  },
  'premium quality': {
    className: 'premium-button-gold-glass',
    icon: '💎',
    label: 'PREMIUM QUALITY'
  },
  'ultra early': {
    className: 'premium-button-orange-glass',
    icon: '🌅',
    label: 'ULTRA EARLY'
  },
  'organic': {
    className: 'premium-button-green-glass',
    icon: '🌿',
    label: 'ORGANIC'
  },
  'cold tolerant': {
    className: 'premium-button-blue-glass',
    icon: '❄️',
    label: 'COLD TOLERANT'
  },
  'rugged': {
    className: 'premium-button-glass',
    icon: '💪',
    label: 'RUGGED'
  }
};

// Function to generate button configurations for a cultivar
export function generateButtonConfigs(cultivar: Cultivar): ButtonConfig[] {
  const buttons: ButtonConfig[] = [];
  
  // Add flower type button (day-neutral or short-day)
  if (cultivar.flowerType === 'DN') {
    buttons.push({
      id: 'day-neutral',
      ...attributeButtonMap['day-neutral']
    });
  } else if (cultivar.flowerType === 'SD') {
    buttons.push({
      id: 'short-day',
      ...attributeButtonMap['short-day']
    });
  }
  
  // Add attribute buttons
  [...cultivar.attributes, ...cultivar.attribute2].forEach(attr => {
    const buttonConfig = attributeButtonMap[attr];
    if (buttonConfig) {
      const generatedId = attr.replace(/\s+/g, '-').toLowerCase();
      buttons.push({
        id: generatedId,
        ...buttonConfig
      });
    }
  });
  
  return buttons;
} 