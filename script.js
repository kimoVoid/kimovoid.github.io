const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const player = urlParams.get('player');

const playerTemplate = ({ name, rank, uuid }) => `
            <div id="playername">
                <div class="role ${rank}">${rank}</div> ${name} <img src="https://crafatar.com/avatars/${uuid}?overlay=true" style="height: 40px; margin-left: 10px; border-radius: 8px;">
            </div>
            <span style="color: var(--halfopaque); font-size: 15px; margin-top: 10px;">UUID: ${uuid}</span>
`;

const playerTemplatePlus = ({ name, rank, uuid, pluscolor, pluses, rankcolor }) => `
            <div id="playername">
                <div class="role ${rankcolor}">${rank}<span style="color: ${pluscolor}; font-weigth: 800;">${pluses}</span></div> ${name} <img src="https://crafatar.com/avatars/${uuid}?overlay=true" style="height: 40px; margin-left: 10px; border-radius: 8px;">
            </div>
            <span style="color: var(--halfopaque); font-size: 15px; margin-top: 10px;">UUID: ${uuid}</span>
`;

const quickbuyTemplate = `
    <div id="inventory">
        <div id="row-1"></div>
        <div id="row-2"></div>
        <div id="row-3"></div>
    </div>
`;


if(player != null) {
    $("#inventory-container").empty();
    $("#inventory-container").append('<div><i data-feather="loader" class="loader"></i>Loading...</div>');

    $.ajax({
        dataType: "json",
        url: "https://api.ashcon.app/mojang/v2/user/" + player,
        success: function(data) {
            const playerUuid = data.uuid;

            $.ajax({
                dataType: "json",
                url: "https://api.hypixel.net/player?key=b92a5bc3-5916-4f00-821c-67a939bde4f4&uuid=" + playerUuid,
                success: function(data) {
                    $("#inventory-container").empty();
                    if (data.player === null) {
                        $("#inventory-container").append(`
                        <div id="invalid-player">
                            <div><i data-feather="alert-triangle" style="margin-right: 10px;"></i>Invalid player</div>
                            <div>Player "${player}" does not play on Hypixel</div>
                        </div>
                        `);

                        feather.replace();
                        return;
                    }
                    if (data.player.newPackageRank != null || data.player.rank != null) {
                        if (data.player.rank != null) {
                            $("#inventory-container").append([{ name: data.player.displayname, rank: data.player.rank.replace("YOUTUBER", "YOUTUBE"), uuid: data.player.uuid },].map(playerTemplate).join(''));
                        } else {
                            if (data.player.newPackageRank.includes("_PLUS")) {
                                var plusColor = "#feaa00";
                                var plusType = "+";
                                var rankColor = data.player.newPackageRank.replace("_PLUS", "");
    
                                if (data.player.newPackageRank === "MVP_PLUS") {
                                    plusColor = "#fe5655";
                                    if (data.player.rankPlusColor != null) {
                                        plusColor = data.player.rankPlusColor;
    
                                        // Color translations
                                        plusColor = plusColor.replace("DARK_GRAY", "#555555");
                                        plusColor = plusColor.replace("DARK_RED", "#ac0203");
                                        plusColor = plusColor.replace("DARK_BLUE", "#0902aa");
                                        plusColor = plusColor.replace("DARK_GREEN", "#07a905");
                                        plusColor = plusColor.replace("GOLD", "#fda90c");
                                        plusColor = plusColor.replace("RED", "#fe5655");
                                        plusColor = plusColor.replace("BLUE", "#5555ff");
                                        plusColor = plusColor.replace("GREEN", "#55ff53");
                                        plusColor = plusColor.replace("LIGHT_PURPLE", "#ff55ff");
                                        plusColor = plusColor.replace("PURPLE", "#aa05aa");
                                        plusColor = plusColor.replace("DARK_AQUA", "#09a9ab");
                                    }
                                }
    
                                if (data.player.monthlyPackageRank === "SUPERSTAR") {
                                    plusType = "++";
                                    if (data.player.monthlyRankColor === "GOLD") {
                                        rankColor = "MVP_PLUS_PLUS";
                                    }
                                }
    
                                $("#inventory-container").append([{ name: data.player.displayname, rank: data.player.newPackageRank.replace("_PLUS", ""), uuid: data.player.uuid, pluscolor: plusColor, pluses: plusType, rankcolor: rankColor },].map(playerTemplatePlus).join(''));
                            } else {
                                $("#inventory-container").append([{ name: data.player.displayname, rank: data.player.newPackageRank, uuid: data.player.uuid },].map(playerTemplate).join(''));
                            }
                        }
                    } else {
                        $("#inventory-container").append([{ name: data.player.displayname, rank: "non", uuid: data.player.uuid },].map(playerTemplate).join(''));
                        $(".role").remove();
                    }

                    // no quickbuy or api disabled
                    if (data.player.stats === undefined || data.player.stats.Bedwars === undefined || data.player.stats.Bedwars.favourites_2 === undefined) {
                        $("#inventory-container").append(`
                        <div id="invalid-player" style="margin-top: 20px;">
                            <div><i data-feather="alert-triangle" style="margin-right: 10px;"></i>No QuickBuy :(</div>
                            <div>This player hasn't played BedWars or has disabled their API.</div>
                        </div>
                        `);
                        feather.replace();
                        return;
                    }

                    // parse quickbuy
                    const quickBuy = data.player.stats.Bedwars.favourites_2;
                    $("#inventory-container").append(quickbuyTemplate);
                    var counter = 1;
                    quickBuy.split(",").forEach(item => {
                        counter++;

                        var tooltip = "";
                        if (item != "null") {
                            tooltip = '<span class="tooltiptext">' + parseItemName(item) + '</span>';
                        }

                        if (counter < 9) {
                            $("#row-1").append('<div id="item"><div class="icon-32 ' + parseItem(item) + '" originalitem="' + item + '"></div>' + tooltip + '</div>');
                        }

                        if (counter > 8 && counter < 16) {
                            $("#row-2").append('<div id="item"><div class="icon-32 ' + parseItem(item) + '" originalitem="' + item + '"></div>' + tooltip + '</div>');
                        }

                        if (counter > 15) {
                            $("#row-3").append('<div id="item"><div class="icon-32 ' + parseItem(item) + '" originalitem="' + item + '"></div>' + tooltip + '</div>');
                        }
                    });

                    feather.replace();
                },
                error: function(error) {
                    $("#inventory-container").empty();
                    $("#inventory-container").append(`
                    <div id="invalid-player">
                        <div><i data-feather="alert-triangle" style="margin-right: 10px;"></i>Invalid player</div>
                        <div>Player "${player}" does not play on Hypixel</div>
                    </div>
                    `);
        
                    feather.replace();
                }
            });
        },
        error: function(error) {
            $("#inventory-container").empty();
            $("#inventory-container").append(`
            <div id="invalid-player">
                <div><i data-feather="alert-triangle" style="margin-right: 10px;"></i>Invalid player</div>
                <div>Username "${player}" is not a real Minecraft player</div>
            </div>
            `);

            feather.replace();
        }
    });
}

function parseItem(item) {
    if (item === "null") return "air";
    if (item === "wool") return "white-wool";
    if (item === "stone_sword") return "stone-sword";
    if (item === "iron_sword") return "iron-sword";
    if (item === "diamond_sword") return "diamond-sword";
    if (item === "chainmail_boots") return "chainmail-boots";
    if (item === "iron_boots") return "iron-boots";
    if (item === "diamond_boots") return "diamond-boots";
    if (item === "ender_pearl") return "ender-pearl";
    if (item === "golden_apple") return "golden-apple";
    if (item === "wooden_pickaxe") return "wooden-pickaxe";
    if (item === "wooden_axe") return "wooden-axe";
    if (item === "shears") return "shears";
    if (item === "jump_v_potion_(45_seconds)") return "potion-of-leaping";
    if (item === "invisibility_potion_(30_seconds)") return "potion-of-invisibility";
    if (item === "speed_ii_potion_(45_seconds)") return "potion-of-fire-resistance";
    if (item === "bridge_egg") return "egg";
    if (item === "magic_milk") return "milk-bucket";
    if (item === "tnt") return "tnt";
    if (item === "fireball") return "fire-charge";
    if (item === "water_bucket") return "water-bucket";
    if (item === "ladder") return "ladder";
    if (item === "oak_wood_planks") return "oak-planks";
    if (item === "end_stone") return "end-stone";
    if (item === "wall_of_steel") return "block-of-iron";
    if (item === "machine_gun_bow") return "bow-be";
    if (item === "stick_(knockback_i)") return "stick";
    if (item === "arrow") return "arrow";
    if (item === "bow") return "bow-be";
    if (item === "bow_(power_i)") return "bow-be";
    if (item === "bow_(power_i__punch_i)") return "bow-be";
    if (item === "compact_pop-up_tower") return "chest";
    if (item === "hardened_clay") return "white-terracotta";
    if (item === "blast-proof_glass") return "glass";
    if (item === "bedbug") return "snowball";
    if (item === "dream_defender") return "blank-spawn-egg";
    if (item === "obsidian") return "obsidian";

    return "barrier";
}

function parseItemName(item) {
    if (item === "wool") return "Wool";
    if (item === "stone_sword") return "Stone Sword";
    if (item === "iron_sword") return "Iron Sword";
    if (item === "diamond_sword") return "Diamond Sword";
    if (item === "chainmail_boots") return "Chainmail Armor";
    if (item === "iron_boots") return "Iron Armor";
    if (item === "diamond_boots") return "Diamond Armor";
    if (item === "ender_pearl") return "Ender Pearl";
    if (item === "golden_apple") return "Golden Apple";
    if (item === "wooden_pickaxe") return "Pickaxe";
    if (item === "wooden_axe") return "Axe";
    if (item === "shears") return "Shears";
    if (item === "jump_v_potion_(45_seconds)") return "Jump V Potion";
    if (item === "invisibility_potion_(30_seconds)") return "Invisibility Potion";
    if (item === "speed_ii_potion_(45_seconds)") return "Speed II Potion";
    if (item === "bridge_egg") return "Bridge Egg";
    if (item === "magic_milk") return "Magic Milk";
    if (item === "tnt") return "TNT";
    if (item === "fireball") return "Fireball";
    if (item === "water_bucket") return "Water Bucket";
    if (item === "ladder") return "Ladder";
    if (item === "oak_wood_planks") return "Wood";
    if (item === "end_stone") return "End Stone";
    if (item === "wall_of_steel") return "Wall Of Steel";
    if (item === "machine_gun_bow") return "Machine Gun Bow";
    if (item === "stick_(knockback_i)") return "Knockback I Stick";
    if (item === "arrow") return "Arrow";
    if (item === "bow") return "Bow";
    if (item === "compact_pop-up_tower") return "Compact Pop-Up Tower";
    if (item === "hardened_clay") return "Clay";
    if (item === "blast-proof_glass") return "Blast-Proof Glass";
    if (item === "bedbug") return "Bedbug";
    if (item === "bow_(power_i)") return "Bow (Power I)";
    if (item === "bow_(power_i__punch_i)") return "Bow (Power I, Punch I)";
    if (item === "dream_defender") return "Dream Defender";
    if (item === "obsidian") return "Obsidian";

    return "Undefined Item";
}
