try{
const Discord = require('discord.js') //Tanımlamalar
const Client = new Discord.Client() //Tanımlamalar
const settings = require('./settings.json') //Tanımlamalar
const logch = settings.Log_Channel //Tanımlamalar
const requestch = settings.Request_Channel //Tanımlamalar
const prefix = settings.Prefix //Tanımlamalar
const requestcode = settings.Request_Code //Tanımlamalar
const role = settings.Bot_Role //Tanımlamalar

Client.login(settings.Token); //Login kısmı

Client.on('ready', () => {
  console.log('Im ready')
})

//Başvuru ve log kısmı
Client.on('message', async msg => {
  if(msg.channel.id == requestch && !msg.author.bot && msg.content.startsWith(prefix + requestcode)){ //Doğru mesajı collectlemek ve doğru kanaldan almak
    const args = msg.content.split(' ').slice(1) //Arguments
    const appid = args.join(" ") //Mesajın içinden komut kısmını atıp client id yi collectlemek
    if(isNaN(appid) || appid.length>18 || appid.length<18){
      msg.channel.send('Geçersiz Client ID').then(mesaj => setTimeout(function(){
        mesaj.delete()
      },2000))
      setTimeout(function(){
        msg.delete()
      },2000)
    }
    else{
    msg.react("✅") //Kullanıcının gönderdiği mesaja tik işareti reactlarar
    //2 saniye sonra kullanıcının gönderdiği mesajı siler
    setTimeout(function(){
        msg.delete()
      },2000)
    const ch = msg.guild.channels.cache.find(cha => cha.id === logch) //Settingsde id si girilen kanalı mesajın gönderildiği serverda bulmak
    const link = 'https://discord.com/oauth2/authorize?client_id=' + appid +'&scope=bot&permissions=0' //Botun linkini ayarlar
    const embed = new Discord.MessageEmbed() //Log channela gönderilecek embeded
    .setTitle('Bot Başvurusu')
    .addField('Başvuran Kişi','<@!' + msg.author.id + '>')
    .addField('Client Id', appid)
    .addField('Botu Ekle',`[0 Perm](${link})`)
    ch.send(embed).then(mesaj => mesaj.react("👍"))//Oluşturduğumuz embed mesajı log channela gönderme ardından 👍 reactlama 
    }
  }
})

Client.on("guildMemberAdd", member => {
  if(member.bot){
  const role2 = member.guild.roles.cache.find(rol => rol.id == role)
  member.roles.add(role2)
  }
})
}catch(e){}
