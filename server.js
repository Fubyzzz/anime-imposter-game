
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let rooms = {};

const chars = [
 {n:"Naruto Uzumaki",t:"Shonen",h:"are o vointa foarte puternica"},
 {n:"Sasuke Uchiha",t:"Shonen",h:"este legat de razbunare si trecut"},
 {n:"Luffy",t:"Shonen",h:"este foarte liber si ambitios"},
 {n:"Goku",t:"Shonen",h:"iubeste lupta si devine mereu mai puternic"},
 {n:"Light Yagami",t:"Thriller",h:"este foarte inteligent si strategic"},
 {n:"Levi Ackerman",t:"Dark Fantasy",h:"este calm si foarte priceput in lupta"},
 {n:"Eren Yeager",t:"Dark Fantasy",h:"are o dorinta extrema de libertate"},
 {n:"Gojo Satoru",t:"Shonen",h:"este increzator si extrem de puternic"},
 {n:"Tanjiro Kamado",t:"Shonen",h:"este empatic si protector"},
 {n:"Itachi Uchiha",t:"Shonen",h:"ascunde multe secrete"}
];

io.on("connection", socket=>{
 socket.on("join",(data)=>{
   socket.join(data.room);
   if(!rooms[data.room]) rooms[data.room]={players:{},started:false};
   rooms[data.room].players[socket.id]={name:data.name,role:null};
   io.to(data.room).emit("players",Object.values(rooms[data.room].players).map(x=>x.name));
 });

 socket.on("start",(room)=>{
   let r=rooms[room];
   if(!r) return;
   let ids=Object.keys(r.players);
   if(ids.length<3) return;
   let c=chars[Math.floor(Math.random()*chars.length)];
   let imp=ids[Math.floor(Math.random()*ids.length)];
   ids.forEach(id=>{
    if(id==imp){
      io.to(id).emit("role",{imposter:true,text:`IMPOSTOR\nTip anime: ${c.t}\nHint: ${c.h}`});
    }else{
      io.to(id).emit("role",{imposter:false,text:`Personajul este: ${c.n}`});
    }
   });
 });

 socket.on("disconnect",()=>{
  for(let room in rooms){
   delete rooms[room].players[socket.id];
   io.to(room).emit("players",Object.values(rooms[room].players).map(x=>x.name));
  }
 });
});

http.listen(3000,()=>console.log("Pornit pe http://localhost:3000"));
