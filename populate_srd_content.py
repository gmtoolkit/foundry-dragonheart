#!/usr/bin/env python3
import json
import os

def create_ancestry_data():
    """Create comprehensive ancestry data"""
    ancestries = [
        {
            "name": "Daemon",
            "description": "<h2>Daemon</h2><p>Daemons are creatures of elemental chaos and wild magic, born from the intersection of multiple planes. They appear humanoid but bear clear marks of their otherworldly heritage through unusual skin tones, strange markings, or minor physical manifestations of their elemental nature.</p><h3>Ancestry Features</h3><p><strong>Elemental Resistance:</strong> You have resistance to one damage type of your choice (fire, cold, lightning, or poison).</p><p><strong>Chaotic Magic:</strong> Once per long rest, when you roll with Fear, you may choose to reroll both dice and take the new result.</p>",
            "features": [
                {"name": "Elemental Resistance", "description": "You have resistance to one damage type of your choice (fire, cold, lightning, or poison)."},
                {"name": "Chaotic Magic", "description": "Once per long rest, when you roll with Fear, you may choose to reroll both dice and take the new result."}
            ]
        },
        {
            "name": "Drakona",
            "description": "<h2>Drakona</h2><p>The Drakona are descendants of ancient dragons, retaining draconic features like scales, claws, and sometimes small horns or tails. They are proud people with a strong connection to elemental magic and ancient lore.</p><h3>Ancestry Features</h3><p><strong>Dragon Scales:</strong> Your scales provide natural armor. You gain +1 Evasion.</p><p><strong>Elemental Breath:</strong> Once per short rest, you can exhale elemental energy in a close burst, dealing damage to enemies.</p>",
            "features": [
                {"name": "Dragon Scales", "description": "Your scales provide natural armor. You gain +1 Evasion."},
                {"name": "Elemental Breath", "description": "Once per short rest, you can exhale elemental energy in a close burst, dealing damage to enemies."}
            ]
        },
        {
            "name": "Dwarf",
            "description": "<h2>Dwarf</h2><p>Dwarves are a hardy people known for their skill in crafting, their love of the earth and stone, and their fierce loyalty to clan and family. They are typically shorter and more robust than humans, with a natural affinity for working with metal and stone.</p><h3>Ancestry Features</h3><p><strong>Stout:</strong> You have advantage on rolls to resist being moved against your will.</p><p><strong>Craftsmanship:</strong> You gain a +2 bonus when making or repairing items.</p>",
            "features": [
                {"name": "Stout", "description": "You have advantage on rolls to resist being moved against your will."},
                {"name": "Craftsmanship", "description": "You gain a +2 bonus when making or repairing items."}
            ]
        },
        {
            "name": "Elf",
            "description": "<h2>Elf</h2><p>Elves are graceful and long-lived people with a deep connection to magic and nature. They possess keen senses, natural agility, and an intuitive understanding of the mystical forces that shape the world.</p><h3>Ancestry Features</h3><p><strong>Keen Senses:</strong> You can sense magic within Close range, even if you can't see it.</p><p><strong>Nimble:</strong> Once per long rest, you may move to any space within Very Close range as a reaction.</p>",
            "features": [
                {"name": "Keen Senses", "description": "You can sense magic within Close range, even if you can't see it."},
                {"name": "Nimble", "description": "Once per long rest, you may move to any space within Very Close range as a reaction."}
            ]
        },
        {
            "name": "Faerie",
            "description": "<h2>Faerie</h2><p>Faeries are magical beings from the realm of dreams and stories. Small in stature but large in personality, they possess an innate connection to magic and the natural world, often displaying butterfly-like wings or other fey characteristics.</p><h3>Ancestry Features</h3><p><strong>Flight:</strong> You can fly at your normal speed, but must land at the end of your turn or fall.</p><p><strong>Fey Magic:</strong> You know one cantrip-level spell from any domain.</p>",
            "features": [
                {"name": "Flight", "description": "You can fly at your normal speed, but must land at the end of your turn or fall."},
                {"name": "Fey Magic", "description": "You know one cantrip-level spell from any domain."}
            ]
        },
        {
            "name": "Firbolg",
            "description": "<h2>Firbolg</h2><p>Firbolgs are gentle giants who serve as guardians of the natural world. Tall and strong, with a deep connection to forests and wild places, they are known for their wisdom and their ability to communicate with beasts and plants.</p><h3>Ancestry Features</h3><p><strong>Giant Strength:</strong> You count as one size larger for carrying capacity and wielding oversized weapons.</p><p><strong>Nature's Voice:</strong> You can communicate simple concepts with beasts and plants.</p>",
            "features": [
                {"name": "Giant Strength", "description": "You count as one size larger for carrying capacity and wielding oversized weapons."},
                {"name": "Nature's Voice", "description": "You can communicate simple concepts with beasts and plants."}
            ]
        },
        {
            "name": "Galapa",
            "description": "<h2>Galapa</h2><p>The Galapa are a turtle-like people who carry their homes on their backs. Patient and wise, they are natural philosophers and historians, known for their long memories and measured approach to life.</p><h3>Ancestry Features</h3><p><strong>Natural Armor:</strong> Your shell provides protection. You gain +2 HP.</p><p><strong>Retract:</strong> As a reaction, you can retract into your shell, gaining resistance to all damage until the start of your next turn.</p>",
            "features": [
                {"name": "Natural Armor", "description": "Your shell provides protection. You gain +2 HP."},
                {"name": "Retract", "description": "As a reaction, you can retract into your shell, gaining resistance to all damage until the start of your next turn."}
            ]
        },
        {
            "name": "Giant",
            "description": "<h2>Giant</h2><p>Giants are towering humanoids with immense strength and presence. They come in many varieties, from cloud giants who dwell in mountain peaks to stone giants who shape the earth itself.</p><h3>Ancestry Features</h3><p><strong>Massive:</strong> You are one size larger than normal and gain +3 HP.</p><p><strong>Mighty Throw:</strong> You can throw objects and creatures much farther than normal.</p>",
            "features": [
                {"name": "Massive", "description": "You are one size larger than normal and gain +3 HP."},
                {"name": "Mighty Throw", "description": "You can throw objects and creatures much farther than normal."}
            ]
        },
        {
            "name": "Goblin",
            "description": "<h2>Goblin</h2><p>Goblins are small, clever creatures known for their resourcefulness and adaptability. Often underestimated, they make up for their size with cunning, agility, and an uncanny ability to find opportunities in chaos.</p><h3>Ancestry Features</h3><p><strong>Small but Mighty:</strong> You can move through spaces occupied by larger creatures.</p><p><strong>Scrappy:</strong> When you take damage, you may move up to your speed as a reaction.</p>",
            "features": [
                {"name": "Small but Mighty", "description": "You can move through spaces occupied by larger creatures."},
                {"name": "Scrappy", "description": "When you take damage, you may move up to your speed as a reaction."}
            ]
        },
        {
            "name": "Halfling",
            "description": "<h2>Halfling</h2><p>Halflings are a cheerful and adaptable people who find joy in life's simple pleasures. Known for their luck, courage, and strong sense of community, they often serve as the heart that binds adventuring groups together.</p><h3>Ancestry Features</h3><p><strong>Lucky:</strong> Once per session, you may reroll any dice roll you make.</p><p><strong>Brave:</strong> You have advantage on rolls to resist fear effects.</p>",
            "features": [
                {"name": "Lucky", "description": "Once per session, you may reroll any dice roll you make."},
                {"name": "Brave", "description": "You have advantage on rolls to resist fear effects."}
            ]
        },
        {
            "name": "Human",
            "description": "<h2>Human</h2><p>Humans are versatile and ambitious people who adapt quickly to new situations. Though they lack the specialized traits of other ancestries, their determination and flexibility allow them to excel in any path they choose.</p><h3>Ancestry Features</h3><p><strong>Ambitious:</strong> Choose an additional Experience during character creation.</p><p><strong>Versatile:</strong> Once per long rest, you may add +2 to any trait roll.</p>",
            "features": [
                {"name": "Ambitious", "description": "Choose an additional Experience during character creation."},
                {"name": "Versatile", "description": "Once per long rest, you may add +2 to any trait roll."}
            ]
        },
        {
            "name": "Katari",
            "description": "<h2>Katari</h2><p>The Katari are a feline people with natural grace and hunting instincts. They possess retractable claws, enhanced senses, and a deep connection to both civilization and the wild.</p><h3>Ancestry Features</h3><p><strong>Feline Agility:</strong> You can move through difficult terrain without penalty.</p><p><strong>Predator's Senses:</strong> You can see in dim light and have advantage on tracking rolls.</p>",
            "features": [
                {"name": "Feline Agility", "description": "You can move through difficult terrain without penalty."},
                {"name": "Predator's Senses", "description": "You can see in dim light and have advantage on tracking rolls."}
            ]
        },
        {
            "name": "Kobold",
            "description": "<h2>Kobold</h2><p>Kobolds are small, draconic humanoids known for their cunning and their ability to work together in groups. They are natural tinkers and trap-makers, often compensating for individual weakness through clever teamwork.</p><h3>Ancestry Features</h3><p><strong>Pack Tactics:</strong> When an ally is within Very Close range of your target, you gain +1 to attack rolls.</p><p><strong>Tinker:</strong> You can create small mechanical devices and traps with appropriate materials.</p>",
            "features": [
                {"name": "Pack Tactics", "description": "When an ally is within Very Close range of your target, you gain +1 to attack rolls."},
                {"name": "Tinker", "description": "You can create small mechanical devices and traps with appropriate materials."}
            ]
        },
        {
            "name": "Orc",
            "description": "<h2>Orc</h2><p>Orcs are a proud warrior people with a strong tribal culture. Known for their physical prowess and passionate nature, they value strength, honor, and loyalty to their clan above all else.</p><h3>Ancestry Features</h3><p><strong>Powerful Build:</strong> You count as one size larger for determining carrying capacity.</p><p><strong>Relentless:</strong> When reduced to 0 HP, you may make one final action before falling unconscious.</p>",
            "features": [
                {"name": "Powerful Build", "description": "You count as one size larger for determining carrying capacity."},
                {"name": "Relentless", "description": "When reduced to 0 HP, you may make one final action before falling unconscious."}
            ]
        },
        {
            "name": "Ribbet",
            "description": "<h2>Ribbet</h2><p>Ribbets are amphibious frog-folk who are equally at home in water and on land. They are known for their powerful jumping ability, their loud voices, and their connection to both aquatic and terrestrial environments.</p><h3>Ancestry Features</h3><p><strong>Amphibious:</strong> You can breathe both air and water and have a swimming speed equal to your normal speed.</p><p><strong>Powerful Leap:</strong> Your jumping distance is doubled, and you take no damage from falls of 20 feet or less.</p>",
            "features": [
                {"name": "Amphibious", "description": "You can breathe both air and water and have a swimming speed equal to your normal speed."},
                {"name": "Powerful Leap", "description": "Your jumping distance is doubled, and you take no damage from falls of 20 feet or less."}
            ]
        },
        {
            "name": "Simiah",
            "description": "<h2>Simiah</h2><p>The Simiah are an ape-like people known for their intelligence, curiosity, and strong social bonds. They are natural climbers and tool-users, with a talent for solving complex problems through ingenuity.</p><h3>Ancestry Features</h3><p><strong>Brachiator:</strong> You have a climbing speed equal to your normal speed.</p><p><strong>Tool Use:</strong> You can use improvised weapons and tools with greater effectiveness, gaining +1 to rolls with improvised equipment.</p>",
            "features": [
                {"name": "Brachiator", "description": "You have a climbing speed equal to your normal speed."},
                {"name": "Tool Use", "description": "You can use improvised weapons and tools with greater effectiveness, gaining +1 to rolls with improvised equipment."}
            ]
        },
        {
            "name": "Syca",
            "description": "<h2>Syca</h2><p>Syca are humanoid fungi who grow and change throughout their lives. They have a deep connection to decay and renewal, understanding that death feeds life in an endless cycle.</p><h3>Ancestry Features</h3><p><strong>Fungal Network:</strong> You can communicate with other fungi and sense their presence within Close range.</p><p><strong>Decomposer:</strong> You can break down organic matter with a touch, useful for both destruction and creating fertile soil.</p>",
            "features": [
                {"name": "Fungal Network", "description": "You can communicate with other fungi and sense their presence within Close range."},
                {"name": "Decomposer", "description": "You can break down organic matter with a touch, useful for both destruction and creating fertile soil."}
            ]
        },
        {
            "name": "Tanuki",
            "description": "<h2>Tanuki</h2><p>Tanuki are raccoon-like tricksters known for their shapeshifting abilities and mischievous nature. They are master illusionists and enjoy playing pranks, though they are ultimately good-hearted people.</p><h3>Ancestry Features</h3><p><strong>Shapeshift:</strong> You can take the form of a small animal or inanimate object for up to one hour per day.</p><p><strong>Trickster:</strong> You have advantage on rolls to deceive, hide, or perform sleight of hand.</p>",
            "features": [
                {"name": "Shapeshift", "description": "You can take the form of a small animal or inanimate object for up to one hour per day."},
                {"name": "Trickster", "description": "You have advantage on rolls to deceive, hide, or perform sleight of hand."}
            ]
        }
    ]
    
    entries = []
    for i, ancestry in enumerate(ancestries):
        entry = {
            "name": ancestry["name"],
            "type": "ancestry",
            "img": "icons/environment/people/group.webp",
            "system": {
                "description": ancestry["description"],
                "features": ancestry["features"]
            },
            "effects": [],
            "flags": {},
            "_id": f"ancestry{i+1:08d}"
        }
        entries.append(entry)
    
    return entries

def create_community_data():
    """Create comprehensive community data"""
    communities = [
        {
            "name": "Lorekeeper",
            "description": "<h2>Lorekeeper</h2><p>You come from a tradition of scholars, historians, and knowledge-seekers. Whether trained in ancient libraries or taught by traveling sages, you have dedicated your life to preserving and sharing wisdom.</p>",
            "feature": "You gain +2 to rolls involving history, lore, or ancient knowledge. Once per session, you can recall a useful piece of information relevant to the current situation."
        },
        {
            "name": "Ridgelands Trader",
            "description": "<h2>Ridgelands Trader</h2><p>You have spent your life traveling the trade routes that connect distant settlements. You know the value of goods, the ways of merchants, and how to survive in the wilderness between civilized lands.</p>",
            "feature": "You gain +2 to rolls involving commerce, appraisal, or navigation. You have contacts in trading posts and merchant guilds across the realm."
        },
        {
            "name": "Order of the Sanctum",
            "description": "<h2>Order of the Sanctum</h2><p>You belong to a religious or philosophical order dedicated to protecting sacred places and ancient knowledge. Your training has prepared you to face supernatural threats and guard against corruption.</p>",
            "feature": "You gain +2 to rolls against supernatural creatures and magical effects. Once per long rest, you can create a blessed ward that protects an area."
        },
        {
            "name": "Underfoot Collective",
            "description": "<h2>Underfoot Collective</h2><p>You come from a community of outcasts, refugees, and those forgotten by society. Living in the margins has taught you resourcefulness and the importance of mutual aid.</p>",
            "feature": "You gain +2 to rolls involving stealth, survival, or helping others in need. You can always find shelter and basic supplies in urban areas."
        },
        {
            "name": "Wandering Folk",
            "description": "<h2>Wandering Folk</h2><p>Your people have no permanent home, instead traveling in caravans, ships, or nomadic groups. You have seen many lands and learned to adapt to different cultures and environments.</p>",
            "feature": "You gain +2 to rolls involving travel, cultural knowledge, or adaptation. You can communicate basic ideas with anyone, regardless of language barriers."
        },
        {
            "name": "Circle of the Spores",
            "description": "<h2>Circle of the Spores</h2><p>You belong to a druidic circle that understands the necessity of death and decay in the natural cycle. You have learned to work with fungi, disease, and decomposition as forces of renewal.</p>",
            "feature": "You gain +2 to rolls involving nature, disease, or death magic. You can accelerate natural decay or growth processes."
        },
        {
            "name": "Covenant of the Tide",
            "description": "<h2>Covenant of the Tide</h2><p>Your community lives by or on the sea, understanding the ocean's moods and mysteries. You are equally comfortable on deck or underwater, and you know the old stories of what lurks beneath the waves.</p>",
            "feature": "You gain +2 to rolls involving swimming, sailing, or sea lore. You can hold your breath for extended periods and have advantage in aquatic environments."
        },
        {
            "name": "Court of Howls",
            "description": "<h2>Court of Howls</h2><p>You come from a wild community that lives close to nature and beast-kind. Whether raised by wolves, living among wild folk, or serving as a beast-speaker, you understand the primal world.</p>",
            "feature": "You gain +2 to rolls involving animals or wilderness survival. You can communicate with beasts and have advantage on rolls to track or hunt."
        },
        {
            "name": "Ember Isle Collective",
            "description": "<h2>Ember Isle Collective</h2><p>Your community has learned to harness volcanic energy and live in harmony with elemental fire. You come from forges and workshops where metal and flame are shaped by skilled artisans.</p>",
            "feature": "You gain +2 to rolls involving crafting, fire magic, or working with metals. You have resistance to fire damage and can work with extremely hot materials."
        }
    ]
    
    entries = []
    for i, community in enumerate(communities):
        entry = {
            "name": community["name"],
            "type": "community",
            "img": "icons/environment/settlement/city.webp",
            "system": {
                "description": community["description"],
                "feature": community["feature"]
            },
            "effects": [],
            "flags": {},
            "_id": f"community{i+1:08d}"
        }
        entries.append(entry)
    
    return entries

def write_compendium_file(filename, entries):
    """Write entries to a compendium file"""
    with open(f"packs/{filename}", "w") as f:
        for entry in entries:
            f.write(json.dumps(entry, separators=(',', ':')) + '\n')

def main():
    print("Creating comprehensive Daggerheart SRD content...")
    
    # Create ancestries
    print("Creating ancestries...")
    ancestries = create_ancestry_data()
    write_compendium_file("ancestries.db", ancestries)
    print(f"Created {len(ancestries)} ancestries")
    
    # Create communities 
    print("Creating communities...")
    communities = create_community_data()
    write_compendium_file("communities.db", communities)
    print(f"Created {len(communities)} communities")
    
    print("SRD content creation complete!")
    print(f"Total entries created: {len(ancestries) + len(communities)}")

if __name__ == "__main__":
    main() 