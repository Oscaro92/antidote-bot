const dotenv = require("dotenv").config();
const Discord = require('discord.js');
const {randomCode} = require("./function");

const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MEMBERS",
        "GUILD_BANS",
        "GUILD_INTEGRATIONS",
        "GUILD_WEBHOOKS",
        "GUILD_INVITES",
        "GUILD_VOICE_STATES",
        "GUILD_PRESENCES",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MESSAGE_TYPING",
        "DIRECT_MESSAGES",
        "DIRECT_MESSAGE_REACTIONS",
        "DIRECT_MESSAGE_TYPING",
    ],
    partials: [
        'MESSAGE',
        'CHANNEL',
        'REACTION'
    ]
})

const prefix = "!";

//* Bot online
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

//* Channel Hall > Accueil (message)
client.on("message", function (message) {
    if (message.type === "GUILD_MEMBER_JOIN") {
        message.member.roles.add("968872160745648138").catch(console.error);
    }
});

//* Channel Service > create-message (message)
client.on('message', function (message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    if (message.channel.id !== "968892095999913984") return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "update") {
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Des informations')
            .setDescription('Tu cherches des informations sur un site, une application, une Web App. Récupérer une base de client, de la données, exploiter une API.');
        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('button1')
                    .setLabel('Commander')
                    .setStyle('SECONDARY'), //PRIMARY
            );

        message.channel.send({ephemeral: true, embeds: [embed], components: [row]});
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "button1") {
        let everyoneRole = interaction.guild.roles.cache.find(r => r.name === '@everyone');

        const Newchannel = await interaction.member.guild.channels.create("command-" + randomCode(6), {
            type: "GUILD_TEXT",
            permissionOverwrites: [
                {
                    id: interaction.member.id,
                    type: "member",
                    allow: ['VIEW_CHANNEL'],
                },
                {
                    id: everyoneRole.id,
                    type: "role",
                    deny: ['VIEW_CHANNEL']
                }
            ],
        })

        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle("Indications")
            .setDescription("Dis moi ce que tu aimerais savoir ou récupérer ? \n" +
                "Envoie moi le plus d'informations possible (url, les données en particulier) \n" +
                "Je te réponds le plus vite possible et te donnes un prix !");

        await interaction.guild.channels.cache.get(Newchannel.id).send({ephemeral: true, embeds: [embed]});
        interaction.deferReply();
        interaction.deleteReply();
    }
});

client.login(process.env.TOKEN_BOT);