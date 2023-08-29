const SETTINGS = {
  path: '/ffa',
  bans: [],
  banips: [],
  mutes: [],
  admins: ['cs641311', 'DIO', 'Celestial', 'bradley'],
  ppm: 10, // players per room
  log_strain: false, // Show messages per second in logs
  ups_boost: false, // Can lag clients and servers. Recommened false.
  UPS: 60, // updates per second
  filterProfanity: true, // filter profanity
  port: 15132,
  export: true,
}

import fetch from 'node-fetch';
import express from 'express';
import expressWs from 'express-ws';
import msgpack from 'msgpack-lite';
import Filter from 'bad-words';
import {Engine, Block, Shot, AI, Damage, Tank, getTeam, parseTeamExtras, getUsername} from './public/js/engine.js';

let tickspeed = -1;
const getTickspeed = i => {
  const start = Date.now();
  setTimeout(() => {
    tickspeed = Date.now()-start; 
    getTickspeed();
  });
}
setTimeout(() => getTickspeed());

const filter = new Filter();
export const ffa = express();
const auth = async (username, token) => {
  try {
    const res = await fetch(`http://141.148.128.231/verify?username=${username}&token=${token}`);
    const body = await res.text();
    return body === 'true';
  } catch(e) {
    return false;
  }
}
const deathMessages = [
  `{victim} was killed by {killer}`,
  `{victim} was put out of their misery by {killer}`,
  `{victim} was assassinated by {killer}`,
  `{victim} got comboed by {killer}`,
  `{victim} got eliminated by {killer}`,
  `{victim} was crushed by {killer}`,
  `{victim} had a skill issue while fighting {killer}`,
  `{victim} was sniped by {killer}`,
  `{victim} was exploded by {killer}`,
  `{victim} was executed by {killer}`,
  `{victim} was deleted by {killer}`,
  `{victim} was killed by THE PERSON WITH KILLSTREAK ---> {killer}`,
  `{victim} got buffed, but get nerfed harder by {killer}`,
  `{victim} got flung into space by {killer}`,
  `{victim} was pound into paste by {killer}`,
  `{victim} was fed a healthy dose of explosives by {killer}`,
  `{victim} became another number in {killer}'s kill streak`,
  `{victim} got wrecked by {killer}`,
];
const joinMessages = [
  `{idot} joined the game`,
  `{idot} has a document to present`,
  `{idot} finished their homework`,
  `{idot} found out cs641311 joined the game`,
  `{idot} <--- FLAT SPOTTED!!! ඞTARGETඞ ඞATඞ ඞALLඞ ඞCOSTSඞ!!!`,
  `There is an impostor amogus ඞ`,
  `{idot} found this server ip address`,
  `{idot} accidentally clicked play`,
  `{idot} has bread spam to graciously give everyone`,
  `{idot}.exe is back online`,
  `{idot} wants to go home`,
  `{idot} has some spare time`,
  `{idot} evaded an enemy techer`,
  `a wild {idot} appeared!`,
  `{idot} NEEDS a kilstreak`,
  `{idot} is ready to commit a breadley's flint and steel`,
  `{idot} got the rarest join message... mabye...`,
];
const rageMessages = [
  `{idot}.exe stopped responding`,
  `{idot} left the game`,
  `{idot} ragequit`,
  `{idot} stopped existing`,
  `wild {idot} got away`,
  `wild {idot} fled`,
  `{idot} disconnected`,
  `{idot} lost internet connection`,
  `{idot} is not found`,
  `{idot} left due to a critical condition: skill issue`,
  `{idot} <--- RAGE QUIT LAFF!!! plz bully this man when u see him bc SKILL ISSUE`,
  `{idot} skill issued`,
  `{idot} got techered`,
  `{idot} was found by the mob`,
  `{idot} was found guilty`,
  `{idot} was the Impostor (1 impostor remains)`,
  `{idot} touched grass and died`,
  `{idot} dediced to go outside`,
];
var sockets = [], servers = [], incoming_per_second = 0, outgoing_per_second = 0, ffaLevels = [
  [["B4","B4","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B4","B4","B4"],["B4","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B0","B4"],["B4","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B0","B0","B0","B0","B4"],["B4","B0","B0","B0","B0","B0","B2","B2","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B2","B2","B0","B0","B0","B0","B0","B4"],["B5","B4","B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B2","B2","B4","B4","B4","B4","B4","B4","B4","B0","B0","B0","B0","B0","B4","B5"],["B5","B5","B4","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B4","B5","B5"],["B5","B5","B4","B2","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B2","B4","B5","B5"],["B5","B5","B4","B2","B4","B0","B0","B0","B0","B0","B4","B4","B0","B2","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B4","B2","B4","B5","B5"],["B5","B5","B4","B0","B4","B4","B0","B0","B0","B0","B1","B4","B4","B4","B2","B2","B4","B4","B4","B1","B0","B0","B0","B0","B4","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B4","B4","B0","B0","B1","B1","B0","B0","B0","B0","B0","B0","B0","B0","B1","B1","B0","B0","B4","B4","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B0","B4","B4","B1","B1","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B1","B1","B4","B4","B0","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B0","B0","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B0","B0","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B0","B0","B0","B4","B0","B0","B0","B0","B0","B1","B1","B0","B0","B0","B0","B0","B4","B0","B0","B0","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B0","B0","B0","B4","B0","B0","B0","B0","B1","B1","B1","B1","B0","B0","B0","B0","B4","B0","B0","B0","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B2","B0","B0","B0","B2","B0","B0","B0","B1","B1","S","B0","B1","B1","B0","B0","B0","B2","B0","B0","B0","B2","B0","B4","B5","B5"],["B5","B5","B4","B0","B2","B0","B0","B0","B2","B0","B0","B0","B1","B1","B0","B0","B1","B1","B0","B0","B0","B2","B0","B0","B0","B2","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B0","B0","B0","B4","B0","B0","B0","B0","B1","B1","B1","B1","B0","B0","B0","B0","B4","B0","B0","B0","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B0","B0","B0","B4","B0","B0","B0","B0","B0","B1","B1","B0","B0","B0","B0","B0","B4","B0","B0","B0","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B0","B0","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B0","B0","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B0","B4","B4","B1","B1","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B1","B1","B4","B4","B0","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B4","B4","B0","B0","B1","B1","B0","B0","B0","B0","B0","B0","B0","B0","B1","B1","B0","B0","B4","B4","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B4","B0","B0","B0","B0","B1","B4","B4","B4","B2","B2","B4","B4","B4","B1","B0","B0","B0","B0","B4","B4","B0","B4","B5","B5"],["B5","B5","B4","B2","B4","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B4","B2","B4","B5","B5"],["B5","B5","B4","B2","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B2","B4","B5","B5"],["B5","B5","B4","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B4","B5","B5"],["B5","B4","B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B2","B2","B4","B4","B4","B4","B4","B4","B4","B0","B0","B0","B0","B0","B4","B5"],["B4","B0","B0","B0","B0","B0","B2","B2","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B2","B2","B0","B0","B0","B0","B0","B4"],["B4","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B0","B0","B0","B0","B4"],["B4","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B0","B4"],["B4","B4","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B4","B4","B4"]],
  [["B4","B0","B4","B0","B4","B0","B4","B0","B4","B5","B2","B2","B2","B2","B0","B0","B2","B2","B2","B2","B5","B0","B4","B0","B0","B0","B0","B0","B4","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B2","B2","B2","B0","B0","B0","B0","B2","B2","B2","B5","B0","B4","B0","B4","B0","B4","B0","B4","B0"],["B4","B0","B4","B0","B4","B0","B4","B0","B4","B5","B2","B2","B0","B0","B0","B0","B0","B0","B2","B2","B5","B0","B4","B0","B4","B0","B4","B0","B4","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B4","B5","B2","B0","B0","B0","B2","B2","B0","B0","B0","B2","B5","B0","B4","B0","B4","B0","B4","B0","B4","B0"],["B4","B0","B4","B0","B4","B0","B4","B0","B0","B3","B2","B0","B0","B0","B2","B2","B0","B0","B0","B2","B5","B0","B4","B0","B4","B0","B4","B0","B4","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B4","B5","B0","B2","B0","B0","B0","B0","B0","B0","B2","B0","B5","B0","B4","B0","B4","B0","B4","B0","B4","B0"],["B4","B0","B4","B0","B4","B0","B4","B0","B4","B5","B2","B0","B2","B0","B0","B0","B0","B2","B0","B2","B5","B0","B4","B0","B4","B0","B4","B0","B4","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B2","B2","B0","B2","B0","B0","B2","B0","B2","B2","B5","B0","B4","B0","B4","B0","B4","B0","B4","B0"],["B4","B0","B4","B0","B4","B0","B4","B0","B4","B5","B2","B2","B2","B0","B2","B2","B0","B2","B2","B2","B5","B0","B0","B0","B4","B0","B4","B0","B0","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B3","B3","B5","B5","B5","B5","B5","B5","B5","B5","B5","B3","B5","B5","B5","B5"],["B1","B0","B1","B0","B1","B0","B1","B0","B1","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B0","B0","B2","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B2","B0","B0","B0","B2","B0","B2","B2","B0"],["B0","B1","B0","B2","B0","B2","B0","B1","B0","B5","B0","B0","B4","B0","B3","B3","B0","B4","B0","B0","B5","B0","B0","B2","B2","B2","B2","B2","B2","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B0","B0","B0","B4","B3","B3","B4","B0","B0","B0","B5","B2","B2","B2","B0","B0","B0","B0","B0","B0"],["B1","B0","B2","B0","B2","B0","B2","B0","B0","B3","B0","B0","B3","B3","S","B0","B3","B3","B0","B0","B3","B0","B0","B2","B0","B2","B2","B2","B2","B2"],["B1","B0","B2","B0","B2","B0","B2","B0","B0","B3","B0","B0","B3","B3","B0","B0","B3","B3","B0","B0","B3","B0","B0","B2","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B0","B0","B0","B4","B3","B3","B4","B0","B0","B0","B5","B2","B0","B2","B2","B2","B2","B2","B0","B2"],["B0","B1","B0","B2","B0","B2","B0","B1","B0","B5","B0","B0","B4","B0","B3","B3","B0","B4","B0","B0","B5","B0","B0","B2","B0","B0","B0","B2","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B0","B2","B2","B0","B2","B0","B2","B2","B0"],["B1","B0","B1","B0","B0","B0","B1","B0","B1","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B0","B0","B0","B0","B2","B0","B0","B0","B0"],["B5","B5","B5","B5","B3","B5","B5","B5","B5","B5","B5","B5","B5","B5","B3","B3","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B4","B0","B4","B0","B0","B0","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B0","B0","B0","B4","B0","B0","B0","B4","B0"],["B0","B4","B0","B4","B0","B4","B0","B4","B0","B5","B0","B2","B0","B0","B0","B0","B0","B0","B2","B0","B5","B0","B4","B0","B0","B0","B4","B0","B0","B0"],["B0","B4","B0","B4","B0","B4","B0","B4","B0","B5","B0","B0","B2","B0","B2","B2","B0","B2","B0","B0","B5","B0","B0","B0","B4","B0","B0","B0","B4","B0"],["B0","B4","B0","B4","B0","B4","B0","B4","B0","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B0","B4","B0","B0","B0","B4","B0","B0","B0"],["B0","B4","B0","B4","B0","B4","B0","B4","B0","B5","B1","B0","B2","B0","B1","B1","B0","B2","B0","B0","B3","B0","B0","B0","B4","B0","B0","B0","B4","B0"],["B0","B4","B0","B4","B0","B4","B0","B4","B0","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B0","B4","B0","B0","B0","B4","B0","B0","B0"],["B0","B4","B0","B4","B0","B4","B0","B4","B0","B5","B0","B0","B2","B0","B2","B2","B0","B2","B0","B0","B5","B0","B0","B0","B4","B0","B0","B0","B4","B0"],["B0","B4","B0","B4","B0","B4","B0","B4","B0","B5","B0","B2","B0","B0","B0","B0","B0","B0","B2","B0","B5","B0","B4","B0","B0","B0","B4","B0","B0","B0"],["B0","B4","B0","B0","B0","B0","B0","B4","B0","B5","B0","B0","B0","B0","B1","B1","B0","B0","B0","B0","B5","B0","B0","B0","B4","B0","B0","B0","B4","B0"]],
], duelsLevels = [
  [["A","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B5","B5"],["B4","B0","B0","B0","B0","B0","B2","B2","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B2","B2","B0","B0","B0","B4","B5","B5"],["B5","B4","B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B0","B0","B0","B0","B4","B5","B5"],["B5","B5","B4","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B4","B5","B5"],["B5","B5","B4","B2","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B2","B4","B5","B5"],["B5","B5","B4","B2","B4","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B4","B2","B4","B5","B5"],["B5","B5","B4","B0","B4","B4","B0","B0","B0","B0","B0","B4","B4","B4","B2","B2","B4","B4","B4","B1","B0","B0","B0","B0","B4","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B1","B1","B0","B0","B4","B4","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B0","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B1","B1","B4","B4","B0","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B0","B0","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B0","B0","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B0","B0","B0","B4","B0","B0","B0","B0","B0","B1","B1","B0","B0","B0","B0","B0","B4","B0","B0","B0","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B0","B0","B0","B4","B0","B0","B0","B0","B1","B1","B1","B1","B0","B0","B0","B0","B4","B0","B0","B0","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B0","B0","B0","B2","B0","B0","B0","B1","B1","B2","B2","B1","B1","B0","B0","B0","B2","B0","B0","B0","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B0","B0","B0","B2","B0","B0","B0","B1","B1","B2","B2","B1","B1","B0","B0","B0","B2","B0","B0","B0","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B0","B0","B0","B4","B0","B0","B0","B0","B1","B1","B1","B1","B0","B0","B0","B0","B4","B0","B0","B0","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B0","B0","B0","B4","B0","B0","B0","B0","B0","B1","B1","B0","B0","B0","B0","B0","B4","B0","B0","B0","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B0","B0","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B0","B0","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B0","B4","B4","B1","B1","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B0","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B4","B4","B0","B0","B1","B1","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B0","B4","B5","B5"],["B5","B5","B4","B0","B4","B4","B0","B0","B0","B0","B1","B4","B4","B4","B2","B2","B4","B4","B4","B0","B0","B0","B0","B0","B4","B4","B0","B4","B5","B5"],["B5","B5","B4","B2","B4","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B4","B2","B4","B5","B5"],["B5","B5","B4","B2","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B0","B4","B5","B5"],["B5","B5","B4","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B4","B5","B5"],["B5","B5","B4","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B0","B0","B0","B0","B0","B4","B5"],["B5","B5","B4","B0","B0","B0","B2","B2","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B2","B2","B0","B0","B0","B0","B0","B4"],["B5","B5","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B0","B4","B4","B4","B0","B0","B0","B0","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B0","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B"]],
];

if (SETTINGS.log_strain) setInterval(() => {
  console.log('Incoming: ' + incoming_per_second + ' | Outgoing: ' + outgoing_per_second);
  incoming_per_second = 0;
  outgoing_per_second = 0;
}, 1000);

setInterval(() => {
  SETTINGS.bans = SETTINGS.bans.filter(ban => {
    ban.time--;
    return ban.time > 0;
  });

  SETTINGS.mutes = SETTINGS.mutes.filter(mute => {
    mute.time--;
    return mute.time > 0;
  });
}, 60000);

expressWs(ffa);
ffa.ws(SETTINGS.path, socket => {
  sockets.push(socket);
  socket._send = socket.send;
  socket.send = data => socket._send(msgpack.encode(data));
  if (SETTINGS.banips.includes(socket.ip)) {
    socket.send({status: 'error', message: 'Your ip has been banned!'});
    return setImmediate(() => socket.close());
  }
  socket.on('message', async (data) => {
    incoming_per_second++;
    try {
      data = msgpack.decode(data);
    } catch(e) {
      console.log('Invalid data: '+data);
      return socket.close();
    }
    if (!socket.username) {
      if (/\s|:/.test(data.username)) return socket.close();
      const ban = SETTINGS.bans.find(i => i.username === data.username);
      if (ban) {
        socket.send({status: 'error', message: `You are banned. Banned by ${ban.by} for ${ban.reason}. You are banned for ${ban.time} more minutes or until an admin unbans you. You were banned by an admin on this server, not the entire game, so you can join other servers.`});
        return setImmediate(() => socket.close());
      }
      socket.username = data.username;
    }
    if (data.type === 'join') {
      if (!await auth(data.username, data.token)) return socket.send({status: 'error', message: 'Invalid Token.'});
      let joinable;
      if (data.gamemode === 'ffa') {
        joinable = servers.filter(s => s.pt.length < SETTINGS.ppm && s instanceof FFA).sort((a, b) => a.pt.length-b.pt.length);
        if (joinable.length === 0) {
          joinable[0] = new FFA();
          servers.push(joinable[0]);
        }
      } else if (data.gamemode === 'duels') {
        joinable = servers.filter(s => s.pt.length === 1 && s instanceof DUELS); // no need to sort since they will be sorted in order of creation.
        if (joinable.length === 0) {
          joinable[0] = new DUELS();
          servers.push(joinable[0]);
        }
      } else if (data.gamemode === 'tdm') {
        joinable = servers.filter(s => s.mode === 0 && s instanceof TDM).sort((a, b) => a.pt.length-b.pt.length);
        if (joinable.length === 0) {
          joinable[0] = new TDM();
          servers.push(joinable[0]);
        }
      } else if (data.gamemode === 'juggernaut') {
        socket.send({status: 'error', message: 'This gamemode is not ready'});
      }
      if (joinable[0].pt.some(t => t.username === socket.username)) {
        socket.send({status: 'error', message: 'You are already in the server!'});
        return setImmediate(() => socket.close());
      }
      socket.room = servers.indexOf(joinable[0]);
      joinable[0].add(socket, data.tank);
    } else if (data.type === 'update') {
      if (socket.room !== undefined) servers[socket.room].update(data);
    } else if (data.type === 'ping') {
      socket.send({event: 'ping', id: data.id});
    } else if (data.type === 'chat') {
      if (SETTINGS.mutes.find(i => i.username === socket.username)) return;
      let msg = data.msg;
      try {
        msg = SETTINGS.filterProfanity ? filter.clean(msg) : msg;
      } catch(e) {}
      servers[socket.room].logs.push({m: `[${socket.username}] ${msg}`, c: '#ffffff'});
    } else if (data.type === 'command') {
      const func = Commands[data.data[0]], args = data.data;
      if (typeof func === 'function') {
        func.bind(socket)(args);
      } else socket.send({status: 'error', message: 'Command not found.'});
    } else if (data.type === 'stats') {
      const players = servers.reduce((arr, s) => [...arr, ...s.pt.map(t => t.username)], []);
      socket.send({event: 'stats', totalRooms: servers.length, totalPlayers: players.length, players: players, bans: SETTINGS.bans, mutes: SETTINGS.mutes, admins: SETTINGS.admins, out: outgoing_per_second, in: incoming_per_second, sockets: sockets.length});
    } else setTimeout(() => socket.close());
  });
  socket.on('close', (code, reason) => {
    if (servers[socket.room]) servers[socket.room].disconnect(socket, code, reason);
  });
});
const Commands = {
  createteam: function(data) {
    if (data.length !== 2) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    if (servers[this.room].pt.find(t => getTeam(t.team) === data[1])) return this.send({status: 'error', message: 'This team already exists.'});
    if (data[1].includes('@leader') || data[1].includes('@requestor#') || data[1].includes(':') || data[1].length > 20) return this.send({status: 'error', message: 'Team name not allowed.'});
    servers[this.room].pt.find(t => t.username === this.username).team = this.username+':'+data[1]+'@leader';
    servers[this.room].logs.push({m: this.username+' created team '+data[1]+'. Use /join '+data[1]+' to join.', c: '#0000FF'});
  },
  join: function(data) {
    if (data.length !== 2) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    if (servers[this.room].pt.find(t => t.username === this.username).team.includes('@leader')) return this.send({status: 'error', message: 'You must disband your team to join. (/leave)'});
    if (!servers[this.room].pt.find(t => getTeam(t.team) === data[1] && t.team.includes('@leader'))) return this.send({status: 'error', message: 'This team does not exist.'});
    servers[this.room].pt.find(t => t.username === this.username).team += '@requestor#'+data[1];
    servers[this.room].logs.push({m: this.username+' requested to join team '+data[1]+'. Team owner can use /accept '+this.username+' to accept them.', c: '#0000FF'});
  },
  accept: function(data) {
    if (data.length !== 2) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    var leader = servers[this.room].pt.find(t => t.username === this.username), requestor = servers[this.room].pt.find(t => t.username === data[1]);
    if (!requestor) return this.send({status: 'error', message: 'Player not found.'});
    if (leader.team.includes('@leader') && requestor.team.includes('@requestor#') && getTeam(leader.team) === requestor.team.split('@requestor#')[1]) {
      requestor.team = data[1]+':'+getTeam(leader.team);
      servers[this.room].logs.push({ m: data[1]+' has joined team '+getTeam(leader.team), c: '#40C4FF' });
    }
  },
  leave: function() {
    var target = servers[this.room].pt.find(t => t.username === this.username);
    if (target.team.includes('@leader')) servers[this.room].pt.forEach(t => {
      if (getTeam(t.team) === getTeam(target.team)) t.team = t.username+':'+Math.random();
    });
    target.team = this.username+':'+Math.random();
  },
  pay: function(data) {
    if (!SETTINGS.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length !== 3 || new Number(data[2]) === NaN) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    servers[this.room].pt.forEach(t => {
      if (t.username === data[1]) this.socket.send({event: 'pay', amount: new Number(data[2])});
    });
    servers[this.room].logs.push({m: data[1]+' was paid '+data[2]+' by '+this.username, c: '#FFFF20'});
  },
  newmap: function(data) {
    if (!SETTINGS.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    servers[this.room].b = [];
    servers[this.room].levelReader(ffaLevels[Math.floor(Math.random()*ffaLevels.length)]);
    servers[this.room].pt.forEach(t => {
      t.x = servers[this.room].spawn.x;
      t.y = servers[this.room].spawn.y;
      t.socket.send({event: 'override', data: [{key: 'x', value: t.x}, {key: 'y', value: t.y}]});
    });
  },
  banip: function(data) {
    return this.send({status: 'error', messsage: "We wouldn't want another evanism catastrophe, now, would we?"});
    if (!SETTINGS.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length !== 2) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    var ip;
    try {
      var ip = servers[this.room].pt.find(t => t.username === data[1]).socket.ip;
    } catch(e) {
      return this.send({status: 'error', message: 'Player not found.'});
    }
    SETTINGS.banips.push(ip);
    sockets.forEach(s => {
      if (!s.ip === ip) return;
      s.send({status: 'error', message: 'You were just ip banned!'});
      setTimeout(() => s.close());
    });
    servers[this.room].logs.push({m: data[1]+`'s ip, `+ip+`, has been banned.`, c: '#FF0000'});
  },
  unbanip: function(data) {
    if (!SETTINGS.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length !== 2) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    if (SETTINGS.banips.indexOf(data[1]) !== -1) SETTINGS.banips.splice(SETTINGS.banips.indexOf(data[1]), 1);
    servers[this.room].logs.push({m: data[1]+' ip has been unbanned.', c: '#0000FF'});
  },
  ban: function(data) {
    if (!SETTINGS.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length < 4 || isNaN(data[2])) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    if (SETTINGS.admins.includes(data[1])) return this.send({status: 'error', message: `You can't ban another admin!`});
    var l = 3, reason = '', server = servers[this.room];
    while (l<data.length) {
      reason += data[l]+' ';
      l++;
    }
    SETTINGS.bans.push({ username: data[1], by: this.username, time: data[2], reason: reason });
    server.logs.push({ m: this.username+' banned '+data[1]+' for '+data[2]+' minutes because "'+reason+'"', c: '#FF0000' });
    sockets.forEach(s => {
      if (s.username !== data[1]) return;
      s.send({status: 'error', message: 'You were just banned!'});
      setTimeout(() => s.close());
    });
  },
  bans: function(data) {
    if (!SETTINGS.admins.includes(this.username)) return this.send({ status: 'error', message: 'You are not a server admin!' });
    if (data[1]) {
      if (!A.each(SETTINGS.bans, function(i, server) {
        server.logs = server.logs.concat([{m: this.username+`'s Ban Info:`, c: '#FFFF22'}, {m: 'For: '+this.reason, c: '#FFFF22'}, {m: 'Time left: '+this.time, c: '#FFFF22'}, {m: 'Issued by: '+this.by, c: '#FFFF22'}]);
        return true;
      }, 'username', data[1], servers[this.room])) servers[this.room].logs.push({m: '/bans: '+data[1]+' is not banned.', c: '#FF0000'});
    } else {
      var players = [];
      A.each(SETTINGS.bans, function(i, p) {p.push(this.username)}, null, players);
      servers[this.room].logs = servers[this.room].logs.concat([{m: 'Bans Info:', c: '#FFFF22'}, {m: 'All Banned Players: '+players, c: '#FFFF22'}]);
    }
  },
  unban: function(data) {
    if (!SETTINGS.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length !== 2) return this.send({ status: 'error', message: 'Command has invalid arguments.' });
    A.each(SETTINGS.bans, function(i) {SETTINGS.bans.splice(i, 1)}, 'username', data[1]);
    servers[this.room].logs.push({m: data[1]+' is unbanned.', c: '#0000FF'});
  },
  mute: function(data) {
    if (!SETTINGS.admins.includes(this.username)) {
      this.send({ status: 'error', message: 'You are not a server admin!' });
      return;
    }
    if (data.length !== 3 || isNaN(data[2])) {
      this.send({ status: 'error', message: 'Command has invalid arguments.' });
      return;
    }
    SETTINGS.mutes.push({
      username: data[1],
      by: this.username,
      time: data[2],
    });
    servers[this.room].logs.push({m: data[1]+' was muted for '+data[2]+' minutes by '+this.username, c: '#FFFF22'});
  },
  mutes: function(data) {
    if (!SETTINGS.admins.includes(this.username)) {
      this.send({ status: 'error', message: 'You are not a server admin!' });
      return;
    }
    if (data[1]) {
      if (!A.each(SETTINGS.mutes, function(i, server) {
        server.logs = server.logs.concat([{m: this.username+`'s Mute Info:`, c: '#FFFF22'}, {m: 'Time left: '+this.time, c: '#FFFF22'}, {m: 'Issued by: '+this.by, c: '#FFFF22'}]);
        return true;
      }, 'username', data[1], servers[this.room])) servers[this.room].logs.push({m: '/mutes: '+data[1]+' is not muted.', c: '#FF0000'});
    } else {
      var players = [];
      A.each(SETTINGS.mutes, function(i, p) {p.push(this.username)}, null, null, players);
      servers[this.room].logs = servers[this.room].logs.concat([{m: 'Mutes Info:', c: '#FFFF22'}, {m: 'All Muted Players: '+players, c: '#FFFF22'}]);
    }
  },
  unmute: function(data) {
    if (!SETTINGS.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length !== 2) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    A.each(SETTINGS.mutes, function(i) {SETTINGS.mutes.splice(i, 1)}, 'username', data[1]);
    servers[this.room].logs.push({m: data[1]+' is unmuted.', c: '#0000FF'});
  },
  kick: function(data) {
    if (!SETTINGS.admins.includes(this.username)) return this.send({ status: 'error', message: 'You are not a server admin!' });
    if (data.length != 2) return this.send({ status: 'error', message: 'Command has invalid arguments.' });
    A.each(sockets, function(i, socket, data) {
      if (this.username === data[1]) {
        this.send({status: 'error', message: 'You have been kicked by '+socket.username});
        setTimeout(function() {this.close()}.bind(this));
      }
    }, null, null, this, data);
  },
  kill: function(data) {
    if (!SETTINGS.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length != 2) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    for (const s of servers) for (const t of s.pt) if (data[1] === t.username) t.damageCalc(t.x, t.y, 6000, this.username);
  },
  cosmetic: function(data) {
    if (!SETTINGS.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length !== 3) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    var pt = A.search(servers[this.room].pt, 'username', data[1]);
    if (pt === undefined) return this.send({status: 'error', message: 'Player Not Found.'}); else pt.cosmetic = data[2].replaceAll('_', ' ');
  },
  ai: function(data) {
    if (!SETTINGS.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length !== 4) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    servers[this.room].ai.push(new AI(Math.floor(Number(data[1]) / 100) * 100 + 10, Math.floor(Number(data[2]) / 100) * 100 + 10, Number(data[3]), 0, this.username+':horde', servers[this.room]));
  },
};

class A {
  static each(arr, func, key, value, ...param) {
    var l = 0;
    while (l<arr.length) {
      if ((key === undefined || key === null) ? true : (arr[l][key] === value)) {
        var r;
        if (typeof func === 'string') {
          r = arr[l][func].apply(arr[l], param);
        } else {
          param.unshift(l);
          r = func.apply(arr[l], param);
          param.shift();
        }
        if (r !== undefined) return r;
      }
      l++;
    }
  }

  static search(arr, key, value) {
    var l = 0;
    while (l<arr.length) {
      if (arr[l][key] === value) {
        return arr[l];
      }
      l++;
    }
  }

  static collider(x, y, w, h, x2, y2, w2, h2) {
    return ((x > x2 || x+w > x2) && (x < x2+w2 || x+w < x2+w2) && (y > y2 || y+h > y2) && (y < y2+h2 || y+h < y2+h2)) ? true: false;
  }

  static assign(...param) {
    var l = 1;
    while (l<param.length-1) {
      param[0][param[l]] = param[l+1];
      l+=2;
    }
  }
}

class Multiplayer extends Engine {
  constructor(levels) {
    super(levels);
    if (!SETTINGS.fps_boost) this.i.push(setInterval(() => this.send(), 1000/SETTINGS.UPS));
  }

  override(t) {
    t.socket.send({event: 'override', data: [{key: 'x', value: t.x}, {key: 'y', value: t.y}]});
  }

  add(socket, data) {
    data.socket = socket;
    this.logs.push({m: this.joinMsg(data.username), c: '#66FF00'});
    super.add(data);
  }

  update(data) {
    super.update(data);
  }

  send() {
    for (const t of this.pt) {
      const render = {b: new Set(), pt: new Set(), ai: new Set(), s: new Set(), d: new Set()};
      const vx = t.x-860, vy = t.y-560, vw = 1880, vh = 1280;
      const message = {b: [], pt: [], ai: [], s: [], d: [], logs: this.logs, global: this.global, tickspeed, event: 'hostupdate', delete: {b: [], pt: [], ai: [], s: [], d: []}};
      let send = true; // RETURN TO FALSE, TEMPORARILY DISABLED TO ALLOW DYNAMIC UPDATES TO LOGS, TICKSPEED, and GLOBAL
      for (const p of ['b', 'pt', 'ai', 's', 'd']) {
        const ids = new Set(this[p].map(e => e.id));
        this[p].filter(e => A.collider(vx, vy, vw, vh, e.x, e.y, 100, 100)).forEach(e => {
          render[p].add(e.id);
          if (!t.render[p].has(e.id) || e.updatedLast > t.lastUpdate) {
            message[p].push(e.raw);
            send = true;
          }
        });
        t.render[p].forEach(id => {
          if (!render[p].has(id) || !ids.has(id)) {
            message.delete[p].push(id);
            send = true;
          }
        });
      }
      t.render = render;
      t.lastUpdate = Date.now();
     if (send) t.socket.send(message);
      outgoing_per_second++;
    }
  }

  disconnect(socket, code, reason) {
    this.pt = this.pt.filter(t => t.username !== socket.username);
    this.ai = this.ai.filter(ai => getUsername(ai.team) !== socket.username);
    this.logs.push({m: this.rageMsg(socket.username), c: '#E10600'});
    if (this.pt.length === 0) {
      this.i.forEach(i => clearInterval(i));
      this.t.forEach(t => clearTimeout(t));
      servers.splice(servers.indexOf(this), 1);
    }
  }

  deathMsg(victim, killer) {
    return deathMessages[Math.floor(Math.random()*deathMessages.length)].replace('{victim}', victim).replace('{killer}', killer);
  }

  joinMsg(player) {
    return joinMessages[Math.floor(Math.random()*joinMessages.length)].replace('{idot}', player);
  }

  rageMsg(player) {
    return rageMessages[Math.floor(Math.random()*rageMessages.length)].replace('{idot}', player);
  }
}

class FFA extends Multiplayer {
  constructor() {
    super(ffaLevels);
  } 

  ondeath(t, m) {
    t.ded = true;
    if (m.deathEffect) t.dedEffect = {
      x: t.x,
      y: t.y,
      r: t.r,
      id: m.deathEffect,
      start: Date.now(),
      time: 0,
    }
    t.deathsPerMovement++;
    if (t.deathsPerMovement === 1) {
      this.logs.push({m: this.deathMsg(t.username, m.username), c: '#FF8C00'});
      m.socket.send({event: 'kill'});
    } else this.logs.push({m: m.username+' killed an afk player!', c: '#FF0000'});
    A.each(this.ai, function(i, host, t) {
      if (getUsername(this.team) === t.username) {
        host.ai.splice(i, 1);
        i--;
      }
    }, null, null, this, t);
    setTimeout(function() {
      t.socket.send({event: 'ded'});
      t.socket.send({event: 'override', data: [{key: 'x', value: this.spawn.x}, {key: 'y', value: this.spawn.y}]});
      A.assign(t, 'x', this.spawn.x, 'y', this.spawn.y, 'ded', false, 'hp', t.maxHp);
    }.bind(this), 10000);
  }

  ontick() {}
}

class DUELS extends Multiplayer {
  constructor() {
    super(duelsLevels);
    this.round = 1;
    this.mode = 0; // 0 -> waiting for other player, 1 -> 10 second ready timer, 2-> match active
    this.wins = {};
  }

  add(socket, data) {
    super.add(socket, data);
    if (this.pt.length === 1) {
      this.global = 'Waiting For Player...';
    } else {
      this.readytime = Date.now();
      this.mode++;
    }
  }

  ontick() {
    if ([0, 1].includes(this.mode)) {
      this.pt[0].x = 0;
      this.pt[0].y = 0;
      this.override(this.pt[0]);
    }
    if (this.mode === 1) {
      this.pt[1].x = 2920;
      this.pt[1].y = 2920;
      this.override(this.pt[1]);
      this.global = 'Round '+this.round+' in '+(5-Math.floor((Date.now()-this.readytime)/1000));
      if (5-(Date.now()-this.readytime)/1000 <= 0) {
        this.global = '======FIGHT======';
        this.mode = 2;
      }
    }
  }

  ondeath(t, m) {
    t.ded = true;
    this.wins[m.username] = this.wins[m.username] === undefined ? 1 : this.wins[m.username]+1;
    if (this.wins[m.username] === 3) {
      this.global = m.username+' Wins!';
      setTimeout(() => {
        this.pt.forEach(t => {
          t.socket.send({event: 'gameover'});
          t.socket.close();
        });
      }, 5000);
    } else {
      this.global = m.username+' Wins Round '+this.round;
      setTimeout(() => {
        this.pt.forEach(tank => {
          tank.hp = tank.maxHp;
          tank.shields = 0;
          tank.ded = false;
          t.socket.send({event: 'ded'});
        });
        this.b = [];
        this.s = [];
        this.ai = [];
        this.d = [];
        this.levelReader(duelsLevels[0]);
        this.round++;
        this.mode = 1; 
        this.readytime = Date.now();
      }, 5000);
    }
  }

  disconnect(socket, code, reason) {
    if ([1, 2].includes(this.mode)) {
      this.round = 1;
      this.mode = 1;
      this.wins = {};
    }
    this.pt.forEach(t => {
      t.socket.send({event: 'ded'}); // heal and reset cooldowns
      t.hp = t.maxHp;
    }); 
    super.disconnect(socket, code, reason);
  }
}

class TDM extends Multiplayer {
  constructor() {
    super([[]]); // no lobby level for now :(
    this.global = 'Waiting for Players...';
    this.round = 1;
    this.mode = 0; // 0 -> Lobby/Waiting for players, 1 -> About to enter round, 2 -> in game
    this.wins = {RED: 0, BLUE: 0};
  }

  add(socket, data) {
    super.add(socket, data);
    const t = this.pt[this.pt.length-1];
    let red = 0, blue = 0;
    this.pt.forEach(tank => {
      if (tank.color === '#FF0000') {
        red++;
      } else if (tank.color === '#0000FF') {
        blue++;
      }
    });
    if (red > blue) t.color = '#0000FF';
    if (red < blue) t.color = '#FF0000';
    if (red === blue) t.color = (Math.random() < .5 ? '#FF0000' : '#0000FF');
    if (this.pt.length === 4) { // once four players, begin the countdown
      this.readytime = Date.now();
      this.time = 60; // 1 minute starting time
    }
  }

  ontick() {
    if (mode === 0) {
      if ((this.time-(Date.now()-this.readytime)/1000) <= 0) {
        this.mode = 1; // game start
        this.readytime = Date.now();
        this.time = 5;
        this.pt.forEach(t => {
          t.team = t.username+':'+(t.color === '#FF0000' ? 'RED' : 'BLUE');
        });
        this.levelReader(duelsLevels[0]);
      }
    } else if (mode === 1) {
      this.pt.forEach(t => {
        const spawn = getTeam(t.team) === 'BLUE' ? 0 : 1;
        t.x = this.spawns[spawn].x;
        t.y = this.spawns[spawn].y;
        this.override(t);
      });
      this.global = 'Round '+this.round+' in '+(this.time-Math.floor((Date.now()-this.readytime)/1000));
      if ((this.time-(Date.now()-this.readytime)/1000) <= 0) {
        this.global = '======FIGHT======';
        this.mode = 2;
      }
    }
  }

  ondeath(t, m) {
    t.ded = true;
    let allies = 0;
    this.pt.forEach(tank => {
      if (!tank.ded) {
        if (getTeam(tank.team) === getTeam(t.team)) {
          allies++;
        }
      }
    });
    if (allies === 0) {
      const winner = getTeam(m.team);
      this.wins[winner]++;
      if (this.wins[winner] === 3) {
        this.global = winner+' Wins!';
        setTimeout(() => {
          this.pt.forEach(t => {
            t.socket.send({event: 'gameover'});
            t.socket.close();
          });
        }, 5000);
      } else {
        this.global = winner+' Wins Round '+this.round;
        setTimeout(() => {
          this.pt.forEach(tank => {
            tank.hp = tank.maxHp;
            tank.shields = 0;
            tank.ded = false;
            t.socket.send({event: 'ded'});
          });
          this.b = [];
          this.s = [];
          this.ai = [];
          this.d = [];
          this.levelReader(duelsLevels[0]);
          this.round++;
          this.mode = 1; 
          this.readytime = Date.now();
        }, 5000);
      }   
    }
  }
}



if (!SETTINGS.export) ffa.listen(SETTINGS.port);

const Profile = (arr, update) => {
  const functions = [];
  for (let e of arr) {
    if (typeof e !== 'function') continue;
    if (/^\s*class\s+/.test(e.toString())) {
      const n = e.name;
      for (const p of Object.getOwnPropertyNames(e)) {
        if (typeof e[p] === 'function') {
          const f = {name: n+'.'+e[p].name, o: e[p], i: 0, t: 0};
          e[p] = function() {
            const start = process.hrtime();
            const r = f.o.apply(this, arguments);
            f.i++;
            f.t = (f.t*(f.i-1)+Date.now()-start)/f.i;
            const end = process.hrtime(start);
            f.t = (end[0]+Math.floor(end[1]/1000000))+((end[1]%1000000)/1000000);
            update(functions);
            return r;
          }
          functions.push(f);
        }
      }
      for (const p of Object.getOwnPropertyNames(e.prototype)) {
        if (typeof e.prototype[p] === 'function') {
          const f = {name: n+'.'+p, o: e.prototype[p], i: 0, t: 0};
          e.prototype[p] = function() {
            const start = process.hrtime();
            const r = f.o.apply(this, arguments);
            f.i++;
            f.t = (f.t*(f.i-1)+Date.now()-start)/f.i;
            const end = process.hrtime(start);
            f.t = (end[0]+Math.floor(end[1]/1000000))+((end[1]%1000000)/1000000);
            update(functions);
            return r;
          }
          functions.push(f);
        }
      }
    }
  }
}

let lagometer = [];
Profile([Engine, Block, Shot, AI, Damage, FFA, Multiplayer, A], f => {
  lagometer = f;
});
setInterval(() => {
  lagometer.sort((a, b) => b.t - a.t);
  const top = lagometer.slice(0, Math.min(15, lagometer.length));
  console.log('-----PROFILING REPORT-----');
  for (const t of top) console.log(t.name+': '+t.t+' over '+t.i);
}, 10000);
