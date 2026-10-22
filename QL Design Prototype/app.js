'use strict';

const STORE_KEY = 'ql_sim_planner_v1';

const LMS = [
  { id: 'trackman-io', name: 'Trackman iO', type: 'overhead', offY: -6, note: 'Ceiling unit. Follow the Trackman iO install guide for height and offset.' },
  { id: 'uneekor-xo2', name: 'Uneekor EYE XO2', type: 'overhead', offY: -12, note: 'Ceiling unit over the hitting area. Verify the Uneekor height chart.' },
  { id: 'protee-vx', name: 'ProTee VX', type: 'overhead', offY: -8, note: 'Ceiling unit. Verify the ProTee mounting spec.' },
  { id: 'fs-gchawk', name: 'Foresight GCHawk', type: 'overhead', offY: -10, note: 'Ceiling unit. Verify the Foresight height and offset table.' },
  { id: 'fs-gcquad', name: 'Foresight GCQuad', type: 'floor', note: 'Floor unit opposite the golfer, facing the ball.' },
  { id: 'garmin-r50', name: 'Garmin Approach R50', type: 'floor', note: 'Floor unit opposite the golfer, facing the ball.' },
  { id: 'uneekor-mini', name: 'Uneekor EYE MINI LITE', type: 'floor', note: 'Floor unit opposite the golfer, facing the ball.' },
  { id: 'radar-rear', name: 'Radar unit (rear-placed)', type: 'radar', note: 'Behind the ball on the target line. Verify the minimum distance to the screen.' },
];

const PROJS = [
  { id: 'st4k', name: '4K laser short-throw (≈0.81 TR)', tr: 0.81 },
  { id: 'st1080', name: '1080p short-throw (≈0.50 TR)', tr: 0.5 },
  { id: 'std1080', name: '1080p standard throw (≈1.20 TR)', tr: 1.2 },
  { id: 'custom', name: 'Custom / other (enter TR)', tr: 0.8 },
];

const MATS = [
  { id: 'm45', name: "4' × 5' standard mat", w: 48, d: 60 },
  { id: 'm55', name: "5' × 5' dual-strip mat", w: 60, d: 60 },
  { id: 'm510', name: "5' × 10' pro platform (dual-handed)", w: 120, d: 60 },
];

const SOFT = [
  { id: 'gspro', name: 'GSPro' },
  { id: 'e6', name: 'E6 Connect' },
  { id: 'awesome', name: 'Awesome Golf' },
  { id: 'bundled', name: 'Bundled with launch monitor' },
];

const DEFAULT_PB = {
  laborRate: 95, taxRate: 7, designFee: 450, discount: 0,
  screenSqft: 24, frameKit: 1450, panel: 60, turfSqft: 6.5, cup: 85, matCutout: 350, matSqft: 54, lightBar: 420,
  lmMount: 250, projMount: 275, computer: 2200, monitor: 280, tv: 950, tvMount: 140, cablePerFt: 4.5,
  'lm:trackman-io': 19995, 'lm:uneekor-xo2': 15995, 'lm:protee-vx': 4499, 'lm:fs-gchawk': 16999,
  'lm:fs-gcquad': 16000, 'lm:garmin-r50': 4999, 'lm:uneekor-mini': 5999, 'lm:radar-rear': 1500,
  'pj:st4k': 3299, 'pj:st1080': 1599, 'pj:std1080': 999, 'pj:custom': 2000,
  'mat:m45': 900, 'mat:m55': 1350, 'mat:m510': 2600,
  'sw:gspro': 250, 'sw:e6': 300, 'sw:awesome': 1000, 'sw:bundled': 0,
  'hr:screen': 6, 'hr:panel': 0.2, 'hr:turf100': 1.5, 'hr:cup': 0.75, 'hr:mat': 2, 'hr:light': 1.5,
  'hr:lmOver': 3, 'hr:lmFloor': 1, 'hr:proj': 3, 'hr:pc': 2, 'hr:tv': 1.5, 'hr:mon': 1, 'hr:cal': 2,
};

const PB_LABELS = [
  ['General', [['laborRate', 'Labor rate ($/hr)'], ['taxRate', 'Sales tax on equipment (%)'], ['designFee', 'Design + CAD package ($)'], ['discount', 'Default discount ($)']]],
  ['Screen, walls, floor', [['screenSqft', 'Impact screen ($/sq ft)'], ['frameKit', 'Built-in frame + padding kit ($)'], ['panel', "HUSH panel 2'×2' ($ ea)"], ['lightBar', 'Continuous light bar ($ ea)'], ['turfSqft', 'Turf ($/sq ft installed material)'], ['cup', 'Putting cup ($ ea)'], ['matCutout', 'Mat inset / cutout framing ($)'], ['matSqft', 'Custom hitting mat ($/sq ft)'], ['mat:m45', "Mat · 4'×5' ($)"], ['mat:m55', "Mat · 5'×5' dual ($)"], ['mat:m510', "Mat · 5'×10' platform ($)"]]],
  ['Launch monitors', LMS.map((item) => ['lm:' + item.id, item.name + ' ($)']).concat([['lmMount', 'Overhead LM mount ($)']])],
  ['Projection + tech', PROJS.map((item) => ['pj:' + item.id, item.name + ' ($)']).concat([['projMount', 'Projector mount ($)'], ['computer', 'Sim PC ($)'], ['monitor', 'Monitor ($)'], ['tv', 'TV ($ ea)'], ['tvMount', 'TV mount ($ ea)'], ['cablePerFt', 'Cabling + tube ($/ft)']])],
  ['Software', SOFT.map((item) => ['sw:' + item.id, item.name + ' ($)'])],
  ['Labor hours', [['hr:screen', 'Screen system (hr)'], ['hr:panel', 'Per HUSH panel (hr)'], ['hr:light', 'Per light bar (hr)'], ['hr:turf100', 'Turf per 100 sq ft (hr)'], ['hr:cup', 'Per putting cup (hr)'], ['hr:mat', 'Mat inset (hr)'], ['hr:lmOver', 'Overhead LM (hr)'], ['hr:lmFloor', 'Floor LM (hr)'], ['hr:proj', 'Projector (hr)'], ['hr:pc', 'Computer + cabling (hr)'], ['hr:tv', 'Per TV (hr)'], ['hr:mon', 'Monitor (hr)'], ['hr:cal', 'Calibration + walkthrough (hr)']]],
];

const DEFAULT_SPEC = {
  W: 192, D: 240, H: 120, handed: 'RH', golferH: 72, ballX: 0, teeDist: 132,
  screenOffset: 12, sideTrim: 6, topGap: 6, floorGap: 0, aspect: '16:9',
  panelWalls: ['left', 'right', 'ceiling'], panelH: 96, panelRun: 168,
  lm: 'uneekor-xo2', lmAdj: 0, software: 'gspro',
  proj: 'st4k', tr: 0.81, projDrop: 8,
  compWall: 'rear', compPos: 24, monitor: 'wall', monZ: 48, tvCount: 1, tvWall: 'left', tvSize: 65, tvH: 66,
  turf: 'full', mat: 'm55', matCutout: true, cups: 2, soffitCount: 0,
};

const STATUSES = ['Lead', 'Quoted', 'Sold', 'Rough-in', 'Install', 'Complete'];
const CLIENT_TYPES = ['Homeowner', 'Home builder', 'Remodeler', 'Commercial'];

const S = {
  jobs: new Map(),
  currentId: null,
  dirty: false,
  pb: { ...DEFAULT_PB },
  tab: 'sales',
  elevWall: 'screen',
  clientView: false,
  job: null,
};

function newJob(example) {
  return {
    name: example ? 'Example — Omaha basement bay' : 'New sim build',
    client: example ? 'Example client' : '',
    clientType: 'Homeowner',
    location: example ? 'Omaha, NE' : '',
    rep: '',
    status: 'Lead',
    notes: '',
    discount: 0,
    spec: { ...DEFAULT_SPEC, panelWalls: [...DEFAULT_SPEC.panelWalls] },
    checklist: {},
    example: !!example,
  };
}

const $ = (sel) => document.querySelector(sel);
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const r1 = (n) => Math.round(n * 10) / 10;

function ftin(inches) {
  if (!Number.isFinite(Number(inches))) return '—';
  const neg = inches < 0;
  let value = Math.abs(Math.round(inches * 2) / 2);
  let feet = Math.floor(value / 12);
  let inch = r1(value - feet * 12);
  if (inch >= 12) { feet += 1; inch = 0; }
  return (neg ? '−' : '') + feet + "'-" + inch + '"';
}

const money = (n) => '$' + Math.round(Number(n) || 0).toLocaleString('en-US');
const lmOf = (id) => LMS.find((item) => item.id === id) || LMS[0];
const projOf = (id) => PROJS.find((item) => item.id === id) || PROJS[0];
const matOf = (id) => MATS.find((item) => item.id === id) || MATS[1];

function splitFtIn(total) {
  const value = Math.max(0, Math.round((+total || 0) * 2) / 2);
  let feet = Math.floor(value / 12);
  let inch = r1(value - feet * 12);
  if (inch >= 12) { feet += 1; inch = 0; }
  return { feet, inch };
}

function matInches(sp, axis) {
  const preset = matOf(sp.mat);
  const saved = axis === 'w' ? sp.matW : sp.matD;
  if (saved !== '' && saved != null && Number.isFinite(+saved) && +saved >= 12) return +saved;
  return axis === 'w' ? preset.w : preset.d;
}

function lightSeamsFromRun(scrY, run) {
  const panels = Math.ceil(Math.max(0, run) / 24 - 1e-6);
  const seams = [];
  for (let i = 1; i < panels; i += 1) {
    const along = i * 24;
    if (along > run + 0.1) break;
    seams.push({ index: i - 1, y: scrY + along, label: `Panel ${i} · Panel ${i + 1}` });
  }
  return seams;
}

function seamsForSpec(sp) {
  const scrY = Math.max(0, +sp.screenOffset || 0);
  const run = Math.min(Math.max(0, +sp.panelRun || 0), Math.max(0, (+sp.D || 0) - scrY));
  return lightSeamsFromRun(scrY, run);
}

function ensureLights(sp) {
  const count = Math.max(0, Math.min(8, Math.round(+sp.lightCount || 0)));
  sp.lightCount = count;
  if (!Array.isArray(sp.lights)) sp.lights = [];
  for (let i = 0; i < count; i += 1) {
    if (!sp.lights[i] || typeof sp.lights[i] !== 'object') sp.lights[i] = { seam: i };
    if (!Number.isFinite(+sp.lights[i].seam)) sp.lights[i].seam = i;
  }
}

function layoutLights(sp, scrY, run) {
  ensureLights(sp);
  const seams = lightSeamsFromRun(scrY, run);
  if (!seams.length) return [];
  return sp.lights.slice(0, sp.lightCount).map((item, index) => {
    const seam = seams[Math.max(0, Math.min(seams.length - 1, Math.round(+item.seam || 0)))];
    return { index, seam: seam.index, y: seam.y, label: seam.label };
  });
}

function toast(msg) {
  const node = $('#toast');
  node.textContent = msg;
  node.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { node.hidden = true; }, 2200);
}

function hdmiFor(ft) {
  const standard = [15, 25, 35, 50, 75, 100];
  const need = standard.find((size) => size >= ft) || Math.ceil(ft / 25) * 25;
  return { len: need, aoc: need > 25 };
}

function cap(value) { return value ? value[0].toUpperCase() + value.slice(1) : ''; }

function soffitWhere(face) {
  return { left: 'Left wall', right: 'Right wall', ceiling: 'Ceiling', screen: 'Screen wall', floor: 'Floor' }[face] || 'Ceiling';
}

function soffitHeightPhrase(s) {
  return s.face === 'floor' ? `top ${ftin(s.z1)} above the floor` : `bottom ${ftin(s.z0)} above the floor`;
}

function ensureSoffits(sp) {
  const count = Math.max(0, Math.min(6, Math.round(+sp.soffitCount || 0)));
  sp.soffitCount = count;
  if (!Array.isArray(sp.soffits)) sp.soffits = [];
  for (let i = 0; i < count; i += 1) {
    if (!sp.soffits[i] || typeof sp.soffits[i] !== 'object') {
      sp.soffits[i] = { face: 'ceiling', span: 48, proj: 24, drop: 12, pos: '', posY: '' };
    } else if (!['left', 'right', 'ceiling', 'screen', 'floor'].includes(sp.soffits[i].face)) {
      sp.soffits[i].face = 'ceiling';
    }
  }
}

function layoutSoffits(sp, W, D, H) {
  ensureSoffits(sp);
  const saved = (value) => value !== '' && value != null && Number.isFinite(+value);
  const soffits = [];
  for (let i = 0; i < sp.soffitCount; i += 1) {
    const item = sp.soffits[i];
    const face = item.face;
    const free = face === 'ceiling' || face === 'floor';
    const spanMax = face === 'left' || face === 'right' ? D : W;
    const span = clampNum(+item.span || 48, 6, Math.max(6, spanMax));
    const proj = clampNum(+item.proj || (free ? 24 : 12), 2, Math.max(2, free ? D : (face === 'screen' ? D : W) - 6));
    const drop = clampNum(+item.drop || 12, 2, Math.max(2, H - 6));
    let x0;
    let x1;
    let y0;
    let y1;
    if (face === 'left' || face === 'right') {
      const cy = clampNum(saved(item.pos) ? +item.pos : Math.max(span / 2, D - span / 2 - 12), span / 2, Math.max(span / 2, D - span / 2));
      y0 = cy - span / 2;
      y1 = cy + span / 2;
      if (face === 'left') { x0 = 0; x1 = proj; }
      else { x1 = W; x0 = W - proj; }
    } else if (face === 'screen') {
      const cx = clampNum(saved(item.pos) ? +item.pos : W / 2, span / 2, Math.max(span / 2, W - span / 2));
      x0 = cx - span / 2;
      x1 = cx + span / 2;
      y0 = 0;
      y1 = proj;
    } else {
      const cx = clampNum(saved(item.pos) ? +item.pos : W / 2, span / 2, Math.max(span / 2, W - span / 2));
      const cy = clampNum(saved(item.posY) ? +item.posY : Math.max(proj / 2, D - proj / 2 - 12), proj / 2, Math.max(proj / 2, D - proj / 2));
      x0 = cx - span / 2;
      x1 = cx + span / 2;
      y0 = cy - proj / 2;
      y1 = cy + proj / 2;
    }
    const z0 = face === 'floor' ? 0 : H - drop;
    const z1 = face === 'floor' ? drop : H;
    soffits.push({ face, x0, x1, y0, y1, z0, z1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, drop });
  }
  return soffits;
}

function ensureTvs(sp) {
  const count = Math.max(0, Math.min(3, +sp.tvCount || 0));
  if (!Array.isArray(sp.tvs)) sp.tvs = [];
  for (let i = 0; i < count; i += 1) {
    if (!sp.tvs[i] || typeof sp.tvs[i] !== 'object') {
      sp.tvs[i] = {
        wall: i === 0 ? (sp.tvWall || 'left') : (i % 2 ? 'right' : 'left'),
        size: +sp.tvSize || 65,
        pos: sp.tvPos && sp.tvPos[i] != null && sp.tvPos[i] !== '' ? +sp.tvPos[i] : '',
        z: +sp.tvH || 66,
      };
    }
  }
  sp.tvs.length = count;
}

function wallXY(wall, along, W, D) {
  if (wall === 'left') return { x: 0, y: along };
  if (wall === 'right') return { x: W, y: along };
  if (wall === 'rear') return { x: along, y: D };
  return { x: along, y: 0 };
}

function compute(sp) {
  const W = +sp.W;
  const D = +sp.D;
  const H = +sp.H;
  const chk = [];
  const [ax, ay] = String(sp.aspect || '16:9').split(':').map(Number);
  const ratio = ax / ay || 16 / 9;
  const sideTrim = Math.max(0, +sp.sideTrim || 0);
  const topGap = Math.max(0, +sp.topGap || 0);
  const floorGap = Math.max(0, +sp.floorGap || 0);
  const scr = {
    x0: Math.min(sideTrim, W / 2 - 1),
    x1: Math.max(W - sideTrim, W / 2 + 1),
    y: Math.max(0, +sp.screenOffset || 0),
    z0: Math.min(floorGap, H / 2 - 1),
    z1: Math.max(H - topGap, H / 2 + 1),
  };
  scr.w = Math.max(1, scr.x1 - scr.x0);
  scr.h = Math.max(1, scr.z1 - scr.z0);
  const imgW = Math.min(scr.w, scr.h * ratio);
  const imgH = imgW / ratio;
  const img = { w: imgW, h: imgH, x0: (scr.x0 + scr.x1) / 2 - imgW / 2, z0: scr.z0 };
  img.x1 = img.x0 + imgW;
  img.z1 = img.z0 + imgH;
  const ball = { x: W / 2 + (+sp.ballX || 0), y: scr.y + (+sp.teeDist || 0) };
  const handed = sp.handed;
  const stance = 28;
  const golfers = [];
  if (handed !== 'LH') golfers.push({ x: ball.x - stance, y: ball.y, side: 'RH' });
  if (handed !== 'RH') golfers.push({ x: ball.x + stance, y: ball.y, side: 'LH' });
  const swingR = Math.round((+sp.golferH || 72) * 0.92);
  const enteredW = matInches(sp, 'w');
  const enteredD = matInches(sp, 'd');
  const matW = clampNum(enteredW, 12, Math.max(12, W - 12));
  const matD = clampNum(enteredD, 12, Math.max(12, D - 12));
  const catalogMat = MATS.find((item) => item.w === Math.round(matW) && item.d === Math.round(matD));
  const mat = {
    x: ball.x - matW / 2,
    y: ball.y - matD / 2,
    w: matW,
    d: matD,
    name: catalogMat ? catalogMat.name : `Custom mat ${ftin(matW)} × ${ftin(matD)}`,
    custom: !catalogMat,
  };
  const needH = (+sp.golferH || 72) + 40;
  if (enteredW > matW + 0.5 || enteredD > matD + 0.5) chk.push(['warn', `The hitting mat is larger than the open floor. The drawing uses ${ftin(matW)} × ${ftin(matD)}.`]);

  if (scr.w < 48) chk.push(['bad', 'Side trim leaves less than 4 ft of screen width.']);
  if (scr.h < 48) chk.push(['bad', 'Ceiling and floor gaps leave less than 4 ft of screen height.']);
  if (H < needH - 6) chk.push(['bad', `Ceiling ${ftin(H)} is below the estimated driver swing height (~${ftin(needH)} for a ${ftin(sp.golferH)} golfer). Not recommended without a full-swing test.`]);
  else if (H < needH) chk.push(['warn', `Ceiling ${ftin(H)} is tight for a full driver swing (~${ftin(needH)} est.). Do a swing test with the client's driver.`]);
  else chk.push(['good', `Ceiling ${ftin(H)} clears the estimated driver swing height (~${ftin(needH)}).`]);
  if (+sp.teeDist < 120) chk.push(['warn', `Ball is ${ftin(sp.teeDist)} from the screen. 10'–12' is typical for ball speed reading and rebound safety.`]);
  else chk.push(['good', `Ball-to-screen ${ftin(sp.teeDist)} is in the typical 10'–12'+ range.`]);
  const behind = D - ball.y;
  if (behind < 54) chk.push(['bad', `Only ${ftin(behind)} behind the ball. Allow about 4'–5' for the backswing and a walkway.`]);
  else if (behind < 66) chk.push(['warn', `${ftin(behind)} behind the ball is workable but tight for seating.`]);
  else chk.push(['good', `${ftin(behind)} behind the ball for backswing and lounge space.`]);
  golfers.forEach((golfer) => {
    const toWall = golfer.side === 'RH' ? golfer.x : W - golfer.x;
    const sideName = golfer.side === 'RH' ? 'left' : 'right';
    if (toWall < swingR * 0.85) chk.push(['bad', `${golfer.side} golfer stands ${ftin(toWall)} from the ${sideName} wall; swing radius is ~${ftin(swingR)}. Move the ball or widen the bay.`]);
    else if (toWall < swingR) chk.push(['warn', `${golfer.side} golfer has ${ftin(toWall)} to the ${sideName} wall, slightly inside the ~${ftin(swingR)} swing radius.`]);
  });
  if (handed === 'Both' && W < 168) chk.push(['warn', `Dual-handed play usually wants 14'+ of width. This room is ${ftin(W)}.`]);

  const launch = lmOf(sp.lm);
  let lm;
  if (launch.type === 'overhead') lm = { x: ball.x, y: ball.y + (launch.offY || 0) + (+sp.lmAdj || 0), z: H - 4, w: 14, d: 10, mount: 'ceiling' };
  else if (launch.type === 'floor') {
    const opposite = handed === 'LH' ? -1 : 1;
    lm = { x: ball.x + opposite * 26, y: ball.y, z: 0, w: 10, d: 12, mount: 'floor' };
    if (handed === 'Both') chk.push(['warn', 'A floor launch monitor must be moved to the opposite side for left-handed players. Plan an outlet on both sides.']);
  } else {
    lm = { x: ball.x, y: Math.min(D - 12, Math.max(ball.y + 36, ball.y + 96 + (+sp.lmAdj || 0))), z: 0, w: 8, d: 8, mount: 'floor' };
    if (D - ball.y < 96) chk.push(['warn', 'Rear radar needs about 8 ft behind the ball. This room is short for that unit.']);
  }
  lm.name = launch.name;
  lm.type = launch.type;
  lm.note = launch.note;

  const projector = projOf(sp.proj);
  const tr = +sp.tr || projector.tr;
  const throwD = tr * img.w;
  const pj = { x: (img.x0 + img.x1) / 2, y: scr.y + throwD, z: H - (+sp.projDrop || 0), w: 20, d: 16, tr, throwD, name: projector.name };
  if (pj.y > D - 12) chk.push(['bad', `Projector needs ${ftin(throwD)} of throw and would land past the rear wall. Pick a shorter throw ratio or a smaller image.`]);
  if (pj.y > ball.y && Math.abs(pj.y - scr.y) > 1) {
    const lensZ = pj.z + 4;
    const beam = img.z0 + (lensZ - img.z0) * (ball.y - scr.y) / (pj.y - scr.y);
    if (beam < +sp.golferH + 6) chk.push(['warn', `Projector beam is only ~${ftin(beam)} high over the golfer, so the golfer may cast a shadow. Shorten the throw or raise the image.`]);
    else chk.push(['good', `Projector beam clears the golfer's head (~${ftin(beam)} at the ball).`]);
  }
  if (Math.abs(pj.y - ball.y) < 60) {
    if (pj.z < needH) chk.push(['bad', `Projector bottom (${ftin(pj.z)}) is inside the estimated swing height above the hitting area. Use a flush ceiling enclosure, reduce the mount drop, or shift the throw.`]);
    else if (pj.z < needH + 6) chk.push(['warn', `Projector bottom (${ftin(pj.z)}) is close to the swing height over the hitting area. Use a protective ceiling enclosure.`]);
  }
  if (launch.type === 'overhead' && Math.hypot(pj.x - lm.x, pj.y - lm.y) < 24) chk.push(['warn', "Projector and overhead launch monitor are within 2 ft of each other. Confirm the launch monitor's field of view is clear."]);

  const panels = [];
  const HUSH = 24;
  const HUSH_GAP = 1.5;
  const run = Math.min(Math.max(0, +sp.panelRun || 0), Math.max(0, D - scr.y));
  const panelHeight = H;
  const hushSpans = (start, span) => {
    const tiles = [];
    if (span <= 1) return tiles;
    const count = Math.ceil(span / HUSH - 1e-6);
    for (let i = 0; i < count; i += 1) {
      const a0 = start + i * HUSH;
      const a1 = Math.min(start + span, a0 + HUSH);
      if (a1 - a0 > 1) tiles.push([a0, a1]);
    }
    return tiles;
  };
  const hushInset = (a0, a1) => {
    const gap = Math.min(HUSH_GAP, (a1 - a0) * 0.22);
    return [a0 + gap / 2, a1 - gap / 2];
  };
  (sp.panelWalls || []).forEach((wall) => {
    if (wall === 'ceiling') {
      hushSpans(0, W).forEach(([x0, x1]) => {
        hushSpans(scr.y, run).forEach(([y0, y1]) => {
          const [ix0, ix1] = hushInset(x0, x1);
          const [iy0, iy1] = hushInset(y0, y1);
          panels.push({ wall: 'ceiling', x0: ix0, x1: ix1, y0: iy0, y1: iy1, a0: y0, a1: y1, z0: H - 1, z1: H });
        });
      });
      return;
    }
    const alongStart = wall === 'rear' ? 0 : scr.y;
    const alongLen = wall === 'rear' ? W : run;
    hushSpans(alongStart, alongLen).forEach(([a0, a1]) => {
      hushSpans(0, panelHeight).forEach(([z0, z1]) => {
        const [ia0, ia1] = hushInset(a0, a1);
        const gap = Math.min(HUSH_GAP, (z1 - z0) * 0.22);
        const iz0 = z0 <= 0.5 ? z0 : z0 + gap / 2;
        const iz1 = panelHeight - z1 <= 0.5 ? z1 : z1 - gap / 2;
        panels.push({ wall, a0: ia0, a1: ia1, z0: iz0, z1: iz1 });
      });
    });
  });
  if (panels.length) {
    const uneven = [W, run, panelHeight].some((span) => span > 1 && Math.abs(span / HUSH - Math.round(span / HUSH)) > 0.04);
    if (uneven) chk.push(['warn', 'A coverage dimension is not a multiple of 2 ft. Edge HUSH panels are shown as cut positions. Confirm those cuts before ordering.']);
  }

  const cab = { wall: sp.compWall, w: 36, d: 22, h: 34 };
  const compPos = +sp.compPos || 0;
  if (sp.compWall === 'rear') {
    cab.a = Math.min(Math.max(compPos + cab.w / 2, cab.w / 2), W - cab.w / 2);
    cab.x = cab.a;
    cab.y = D - cab.d / 2;
  } else {
    cab.a = Math.min(Math.max(D - compPos - cab.w / 2, scr.y + cab.w / 2), D - cab.w / 2);
    cab.y = cab.a;
    cab.x = sp.compWall === 'left' ? cab.d / 2 : W - cab.d / 2;
  }
  if (sp.compWall !== 'rear' && Math.abs(cab.y - ball.y) < 72) chk.push(['warn', 'Computer cabinet is beside the hitting area. Keep it out of the swing radius or behind padding.']);

  let mon = null;
  if (sp.monitor === 'wall') {
    const wall = handed === 'LH' ? 'left' : 'right';
    const along = sp.monAlong != null && sp.monAlong !== '' ? +sp.monAlong : ball.y - 6;
    const monZ = sp.monZ != null && sp.monZ !== '' ? +sp.monZ : 48;
    mon = { wall, a: Math.min(Math.max(along, scr.y + 12), D - 12), z: monZ, w: 24, h: 14 };
  } else if (sp.monitor === 'cabinet') {
    mon = { wall: cab.wall, a: cab.a, z: cab.h + 10, w: 24, h: 14, onCab: true };
  }

  ensureTvs(sp);
  const tvs = sp.tvs.map((item, index) => {
    const size = Math.min(98, Math.max(32, +item.size || 65));
    const tvW = size * 0.872;
    const tvHt = size * 0.49;
    const wall = item.wall === 'right' || item.wall === 'rear' ? item.wall : 'left';
    let along;
    if (wall === 'rear') along = W * (index + 1) / (sp.tvs.length + 1);
    else {
      const y0 = ball.y + 36;
      const y1 = D - tvW / 2 - 6;
      along = sp.tvs.length === 1 ? (y0 + y1) / 2 : y0 + (y1 - y0) * index / (sp.tvs.length - 1 || 1);
    }
    if (item.pos != null && item.pos !== '') along = +item.pos;
    along = wall === 'rear'
      ? Math.min(Math.max(along, tvW / 2), W - tvW / 2)
      : Math.min(Math.max(along, scr.y + tvW / 2), D - tvW / 2);
    const z = Math.min(Math.max(+item.z || 66, tvHt / 2 + 6), H - tvHt / 2 - 6);
    return { wall, a: along, z, w: tvW, h: tvHt, size };
  });

  const turfArea = sp.turf === 'full' ? W * Math.max(0, D - scr.y) : scr.w * Math.max(0, D - scr.y);
  const cutArea = sp.matCutout ? mat.w * mat.d : 0;
  const green = null;
  const cupCount = Math.max(0, Math.min(4, +sp.cups || 0));
  if (!Array.isArray(sp.cupPos)) sp.cupPos = [];
  const cups = [];
  const cupMinX = 10;
  const cupMaxX = W - 10;
  const cupMinY = scr.y + 8;
  const cupMaxY = D - 10;
  for (let i = 0; i < cupCount; i += 1) {
    const saved = sp.cupPos[i];
    let cupX;
    let cupY;
    if (saved && Number.isFinite(+saved.x) && Number.isFinite(+saved.y)) {
      cupX = +saved.x;
      cupY = +saved.y;
    } else {
      cupX = W * (i + 1) / (cupCount + 1);
      const frontEnd = mat.y - 12;
      cupY = frontEnd - cupMinY >= 24
        ? cupMinY + (frontEnd - cupMinY) * (cupCount === 1 ? 0.55 : (i % 2 ? 0.32 : 0.68))
        : Math.min(cupMaxY, mat.y + mat.d + 24 + i * 28);
    }
    cups.push({
      x: Math.min(cupMaxX, Math.max(cupMinX, cupX)),
      y: Math.min(cupMaxY, Math.max(cupMinY, cupY)),
    });
  }
  const soffits = layoutSoffits(sp, W, D, H);
  const coversPoint = (s, px, py) => px >= s.x0 && px <= s.x1 && py >= s.y0 && py <= s.y1;
  soffits.forEach((s, index) => {
    const name = `Soffit ${index + 1}`;
    const where = soffitWhere(s.face).toLowerCase();
    const nx = Math.min(s.x1, Math.max(s.x0, ball.x));
    const ny = Math.min(s.y1, Math.max(s.y0, ball.y));
    const inSwing = Math.hypot(ball.x - nx, ball.y - ny) < swingR;
    if (s.face === 'floor') {
      if (inSwing) chk.push(['warn', `${name} on the floor rises to ${ftin(s.z1)} inside the swing area.`]);
      if (coversPoint(s, ball.x, ball.y)) chk.push(['warn', `${name} covers the ball. Move the floor bulkhead or the hitting mat.`]);
    } else if (inSwing && s.z0 < needH) {
      chk.push(['warn', `${name} on the ${where} drops to ${ftin(s.z0)} above the floor inside the swing area (~${ftin(needH)} needed).`]);
    }
    if (s.y0 <= scr.y && s.y1 >= scr.y && s.x1 > scr.x0 && s.x0 < scr.x1 && s.z0 < scr.z1 && s.z1 > scr.z0) {
      chk.push(['warn', `${name} crosses the impact screen. Move the screen or the soffit.`]);
    }
    const overlapsZ = (bottom, top) => s.z0 < top && s.z1 > bottom;
    if (coversPoint(s, pj.x, pj.y) && overlapsZ(pj.z - 8, pj.z + 2)) chk.push(['bad', `${name} covers the projector. Move the soffit or change the throw.`]);
    if (lm.mount === 'ceiling' && coversPoint(s, lm.x, lm.y) && overlapsZ(lm.z - 6, lm.z + 2)) chk.push(['warn', `${name} covers the overhead launch monitor.`]);
    if (lm.mount !== 'ceiling' && s.face === 'floor' && coversPoint(s, lm.x, lm.y)) chk.push(['warn', `${name} covers the floor launch monitor.`]);
  });
  const nofix = { x: ball.x, y: ball.y, r: swingR + 12 };

  const backing = [];
  const elec = [];
  const data = [];
  const tubes = [];
  backing.push({ id: 'B1', label: 'Screen frame ceiling blocking', where: 'Ceiling', spec: 'Continuous 2×6 blocking full width, centered on the screen line', plan: { x: 0, y: scr.y - 6, w: W, d: 12 }, x: W / 2, y: scr.y, z: H, size: `${ftin(W)} × 12"` });
  ['left', 'right'].forEach((wall, index) => {
    backing.push({
      id: 'B' + (2 + index),
      label: `Screen frame ${wall} wall backing`,
      where: cap(wall) + ' wall',
      spec: '2×6 vertical backing floor to ceiling, 16" wide, centered on the screen line',
      wall, a0: scr.y - 8, a1: scr.y + 8, z0: 0, z1: H,
      x: wall === 'left' ? 0 : W, y: scr.y, z: H / 2,
      size: `16" × ${ftin(H)}`,
    });
  });
  backing.push({ id: 'B4', label: 'Projector mount blocking', where: 'Ceiling', spec: '2×8 solid blocking between joists, 24"×24" pad', plan: { x: pj.x - 12, y: pj.y - 12, w: 24, d: 24 }, x: pj.x, y: pj.y, z: H, size: '24" × 24"' });
  if (lm.mount === 'ceiling') backing.push({ id: 'B5', label: 'Launch monitor blocking', where: 'Ceiling', spec: '2×8 solid blocking, 24"×36" pad, long axis on the target line', plan: { x: lm.x - 12, y: lm.y - 18, w: 24, d: 36 }, x: lm.x, y: lm.y, z: H, size: '24" × 36"' });
  tvs.forEach((tv, index) => backing.push({ id: 'B' + (6 + index), label: `TV ${index + 1} backing (${tv.size}")`, where: cap(tv.wall) + ' wall', spec: '2×8 horizontal backing, two rows, spanning the mount plus 12"', wall: tv.wall, a0: tv.a - tv.w / 2 + 6, a1: tv.a + tv.w / 2 - 6, z0: tv.z - 14, z1: tv.z + 14, ...wallXY(tv.wall, tv.a, W, D), z: tv.z, size: `${ftin(tv.w - 12)} × 28"` }));
  if (mon && !mon.onCab) backing.push({ id: 'B9', label: 'Monitor arm backing', where: cap(mon.wall) + ' wall', spec: '2×8 backing 16"×16"', wall: mon.wall, a0: mon.a - 8, a1: mon.a + 8, z0: mon.z - 8, z1: mon.z + 8, ...wallXY(mon.wall, mon.a, W, D), z: mon.z, size: '16" × 16"' });
  (sp.panelWalls || []).forEach((wall, index) => {
    if (wall === 'ceiling') {
      backing.push({ id: 'P' + (index + 1), label: 'HUSH ceiling furring', where: 'Ceiling', spec: 'Hat channel or 1×4 furring at 24 in o.c. both ways. Keep the grid clear of the projector, launch monitor, and no-fixture ring.', plan: { x: 0, y: scr.y, w: W, d: run }, x: W / 2, y: scr.y + run / 2, z: H, size: `${ftin(W)} × ${ftin(run)}` });
      return;
    }
    const a0 = wall === 'rear' ? 0 : scr.y;
    const a1 = wall === 'rear' ? W : scr.y + run;
    const rows = [];
    for (let row = 24; row < panelHeight; row += 24) rows.push(row);
    backing.push({ id: 'P' + (index + 1), label: `HUSH nailers — ${wall} wall`, where: cap(wall) + ' wall', spec: '2×4 flat blocking at each horizontal seam (every 24 in) and studs on the vertical seams.', wall, a0, a1, z0: 0, z1: panelHeight, rows, ...wallXY(wall, (a0 + a1) / 2, W, D), z: panelHeight / 2, size: `${ftin(a1 - a0)} run` });
  });
  backing.push({ id: 'B10', label: 'Computer cabinet backing', where: cap(cab.wall) + ' wall', spec: '2×6 horizontal backing at 30"–36" above finished floor for cabinet anchors', wall: cab.wall, a0: cab.a - cab.w / 2, a1: cab.a + cab.w / 2, z0: 28, z1: 38, ...wallXY(cab.wall, cab.a, W, D), z: 33, size: `${ftin(cab.w)} × 10"` });

  elec.push({ id: 'E1', label: 'Projector receptacle', spec: 'Duplex in the ceiling. A dedicated 20A circuit is recommended.', x: pj.x + 16, y: pj.y, z: H, mount: 'ceiling' });
  if (lm.mount === 'ceiling') elec.push({ id: 'E2', label: 'Launch monitor receptacle', spec: 'Duplex in the ceiling beside the launch-monitor blocking', x: lm.x + 18, y: lm.y, z: H, mount: 'ceiling' });
  else {
    const fx = lm.x;
    const fy = lm.y + (lm.type === 'radar' ? 0 : -18);
    elec.push({ id: 'E2', label: 'Launch monitor floor box', spec: 'Flush floor box with duplex and Cat6, set under the turf with an access flap', x: fx, y: fy, z: 0, mount: 'floor' });
    if (handed === 'Both' && lm.type === 'floor') elec.push({ id: 'E2b', label: 'Launch monitor floor box (left-handed side)', spec: 'Second floor box mirrored for a left-handed setup', x: 2 * ball.x - fx, y: fy, z: 0, mount: 'floor' });
  }
  elec.push({ id: 'E3', label: 'Computer receptacles (2)', spec: 'Two duplex outlets at 18" above finished floor behind the cabinet. Dedicated 20A.', wall: cab.wall, a: cab.a, z: 18, ...wallXY(cab.wall, cab.a, W, D), mount: 'wall' });
  tvs.forEach((tv, index) => elec.push({ id: 'E' + (4 + index), label: `TV ${index + 1} recessed power`, spec: 'Recessed power and low-voltage box behind the TV center', wall: tv.wall, a: tv.a, z: tv.z, ...wallXY(tv.wall, tv.a, W, D), mount: 'wall' }));
  if (mon && !mon.onCab) elec.push({ id: 'E7', label: 'Monitor receptacle', spec: 'Duplex behind the monitor', wall: mon.wall, a: mon.a, z: mon.z - 4, ...wallXY(mon.wall, mon.a, W, D), mount: 'wall' });
  elec.push({ id: 'E8', label: 'Room lighting (by electrician)', spec: 'Dimmable cans. None inside the no-fixture ring. Keep light off the screen.', x: W / 2, y: Math.min(D - 30, ball.y + swingR + 30), z: H, mount: 'ceiling', note: true });
  data.push({ id: 'D1', label: 'Cat6 at computer', spec: 'Two Cat6 runs to the network, terminated at the cabinet', wall: cab.wall, a: cab.a + 8, z: 18, ...wallXY(cab.wall, cab.a + 8, W, D) });
  if (lm.mount === 'ceiling') data.push({ id: 'D2', label: 'Cat6 at launch monitor', spec: 'Cat6 pulled to the launch monitor (USB or ethernet extension)', x: lm.x - 18, y: lm.y, z: H });

  const compPt = { x: cab.x, y: cab.y };
  const addTube = (id, label, from, fromZ, fromKind) => {
    const horizontal = Math.abs(from.x - compPt.x) + Math.abs(from.y - compPt.y);
    const vertical = fromKind === 'ceiling' ? (H - 18) : fromKind === 'wall' ? (H - fromZ) + (H - 18) : 18;
    const len = (horizontal + vertical) * 1.15 / 12;
    tubes.push({ id, label, from, len, pts: [[from.x, from.y], [from.x, compPt.y], [compPt.x, compPt.y]], cable: hdmiFor(len) });
  };
  addTube('T1', 'Projector → computer', pj, H, 'ceiling');
  if (lm.mount === 'ceiling') addTube('T2', 'Launch monitor → computer', lm, H, 'ceiling');
  else addTube('T2', 'Launch monitor floor box → computer', { x: lm.x, y: lm.y }, 0, 'floor');
  tvs.forEach((tv, index) => addTube('T' + (3 + index), `TV ${index + 1} → computer`, wallXY(tv.wall, tv.a, W, D), tv.z, 'wall'));
  if (mon && !mon.onCab) addTube('T6', 'Monitor → computer', wallXY(mon.wall, mon.a, W, D), mon.z, 'wall');

  if (sp.lightCount > 0 && !lightSeamsFromRun(scr.y, run).length) chk.push(['warn', 'Light bars need at least two 2 ft panels of coverage. Lengthen the panel run from the screen.']);
  const lights = layoutLights(sp, scr.y, run);
  const fit = chk.some((item) => item[0] === 'bad') ? 'bad' : chk.some((item) => item[0] === 'warn') ? 'warn' : 'good';
  return { W, D, H, scr, img, ball, golfers, swingR, mat, lm, pj, panels, cab, mon, tvs, turfArea, cutArea, green, cups, soffits, lights, nofix, backing, elec, data, tubes, chk, fit, run, needH };
}

function quote(sp, plan, pb) {
  const lines = [];
  const add = (grp, item, qty, unit, price, hrs) => lines.push({ grp, item, qty, unit, price, ext: qty * price, hrs: hrs || 0 });
  const sqft = plan.scr.w * plan.scr.h / 144;
  add('Screen & enclosure', 'Impact screen, wall-to-wall built-in', r1(sqft), 'sq ft', pb.screenSqft, pb['hr:screen']);
  add('Screen & enclosure', 'Built-in frame + padding kit', 1, 'kit', pb.frameKit, 0);
  if (plan.panels.length) add('Screen & enclosure', `HUSH panels, 2×2 ft (${(sp.panelWalls || []).join(', ')})`, plan.panels.length, 'ea', pb.panel, plan.panels.length * (pb['hr:panel'] || 0));
  if (plan.lights.length) add('Screen & enclosure', 'Continuous light bar, walls and ceiling', plan.lights.length, 'ea', pb.lightBar ?? 420, plan.lights.length * (pb['hr:light'] || 0));
  const turfSq = Math.max(0, (plan.turfArea - plan.cutArea) / 144);
  add('Floor', 'Turf ' + (sp.turf === 'full' ? '(full room)' : '(hitting bay)'), Math.round(turfSq), 'sq ft', pb.turfSqft, turfSq / 100 * pb['hr:turf100']);
  if (plan.mat.custom) add('Floor', plan.mat.name, r1(plan.mat.w * plan.mat.d / 144), 'sq ft', pb.matSqft ?? 54, 0);
  else add('Floor', plan.mat.name, 1, 'ea', pb['mat:' + sp.mat] || 0, 0);
  if (sp.matCutout) add('Floor', 'Mat inset / flush cutout framing', 1, 'ea', pb.matCutout, pb['hr:mat']);
  if (plan.cups.length) add('Floor', 'Putting cups', plan.cups.length, 'ea', pb.cup, plan.cups.length * pb['hr:cup']);
  add('Launch monitor', plan.lm.name, 1, 'ea', pb['lm:' + sp.lm] || 0, plan.lm.mount === 'ceiling' ? pb['hr:lmOver'] : pb['hr:lmFloor']);
  if (plan.lm.mount === 'ceiling') add('Launch monitor', 'Overhead mount', 1, 'ea', pb.lmMount, 0);
  add('Launch monitor', 'Software: ' + (SOFT.find((item) => item.id === sp.software) || SOFT[0]).name, 1, 'license', pb['sw:' + sp.software] || 0, 0);
  add('Projection & tech', plan.pj.name, 1, 'ea', pb['pj:' + sp.proj] || 0, pb['hr:proj']);
  add('Projection & tech', 'Projector mount', 1, 'ea', pb.projMount, 0);
  add('Projection & tech', 'Simulator computer', 1, 'ea', pb.computer, pb['hr:pc']);
  if (plan.mon) add('Projection & tech', 'Computer monitor', 1, 'ea', pb.monitor, pb['hr:mon']);
  plan.tvs.forEach((tv, index) => {
    add('Projection & tech', `TV ${index + 1} · ${tv.size}" · ${tv.wall} wall`, 1, 'ea', pb.tv, pb['hr:tv']);
  });
  if (plan.tvs.length) add('Projection & tech', 'TV mount', plan.tvs.length, 'ea', pb.tvMount, 0);
  const feet = Math.round(plan.tubes.reduce((sum, tube) => sum + tube.len, 0));
  add('Projection & tech', 'HDMI/USB/Cat6 cabling + tech tube', feet, 'ft', pb.cablePerFt, 0);
  const hours = lines.reduce((sum, line) => sum + line.hrs, 0) + (pb['hr:cal'] || 0);
  const equip = lines.reduce((sum, line) => sum + line.ext, 0);
  const labor = hours * pb.laborRate;
  const design = pb.designFee;
  const tax = equip * pb.taxRate / 100;
  const disc = +(S.job.discount ?? pb.discount) || 0;
  return { lines, hours, equip, labor, design, tax, disc, total: equip + labor + design + tax - disc };
}

function clampIn(value, max) { return Math.max(6, Math.min(max - 6, value)); }

function callout(x, y, text, radius, color) {
  return `<circle cx="${x}" cy="${y}" r="${radius}" style="fill:${color}"/><text class="s-calltxt" x="${x}" y="${y + radius * 0.38}" text-anchor="middle" font-size="${radius * 1.05}">${esc(text)}</text>`;
}

function elecSym(x, y, radius, mount, note) {
  if (note) return `<circle class="s-elec" cx="${x}" cy="${y}" r="${radius}" stroke-dasharray="2 2"/>`;
  const shape = mount === 'floor'
    ? `<rect class="s-elec" x="${x - radius}" y="${y - radius}" width="${radius * 2}" height="${radius * 2}"/>`
    : `<circle class="s-elec" cx="${x}" cy="${y}" r="${radius}"/>`;
  return shape + `<line class="s-elec" x1="${x - radius * 0.4}" y1="${y - radius * 0.5}" x2="${x - radius * 0.4}" y2="${y + radius * 0.5}"/><line class="s-elec" x1="${x + radius * 0.4}" y1="${y - radius * 0.5}" x2="${x + radius * 0.4}" y2="${y + radius * 0.5}"/>`;
}

function dimH(x1, x2, y, label, fs) {
  const tick = fs * 0.4;
  return `<line class="s-dim" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"/><line class="s-dim" x1="${x1}" y1="${y - tick}" x2="${x1}" y2="${y + tick}"/><line class="s-dim" x1="${x2}" y1="${y - tick}" x2="${x2}" y2="${y + tick}"/><text class="s-dimtxt" x="${(x1 + x2) / 2}" y="${y - tick * 0.8}" text-anchor="middle" font-size="${fs * 0.85}" style="paint-order:stroke;stroke:var(--surface);stroke-width:${fs * 0.3}">${esc(label)}</text>`;
}

function dimV(y1, y2, x, label, fs) {
  const tick = fs * 0.4;
  const mid = (y1 + y2) / 2;
  return `<line class="s-dim" x1="${x}" y1="${y1}" x2="${x}" y2="${y2}"/><line class="s-dim" x1="${x - tick}" y1="${y1}" x2="${x + tick}" y2="${y1}"/><line class="s-dim" x1="${x - tick}" y1="${y2}" x2="${x + tick}" y2="${y2}"/><text class="s-dimtxt" x="${x - tick * 0.8}" y="${mid}" text-anchor="middle" font-size="${fs * 0.85}" transform="rotate(-90 ${x - tick * 0.8} ${mid})" style="paint-order:stroke;stroke:var(--surface);stroke-width:${fs * 0.3}">${esc(label)}</text>`;
}

function refNum(value) { return Math.round(value * 10) / 10; }

function refSeg(x1, y1, x2, y2, label, fs, t = 0.5) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (!(len > Math.max(8, fs * 0.45))) return '';
  const tick = Math.max(3, fs * 0.28);
  const nx = -dy / len;
  const ny = dx / len;
  const at = Math.min(0.82, Math.max(0.18, t));
  const mx = x1 + dx * at + nx * fs * 0.62;
  const my = y1 + dy * at + ny * fs * 0.62;
  let rot = Math.atan2(dy, dx) * 180 / Math.PI;
  if (rot > 90) rot -= 180;
  else if (rot < -90) rot += 180;
  return `<line x1="${refNum(x1)}" y1="${refNum(y1)}" x2="${refNum(x2)}" y2="${refNum(y2)}"/>`
    + `<line x1="${refNum(x1 - nx * tick)}" y1="${refNum(y1 - ny * tick)}" x2="${refNum(x1 + nx * tick)}" y2="${refNum(y1 + ny * tick)}"/>`
    + `<line x1="${refNum(x2 - nx * tick)}" y1="${refNum(y2 - ny * tick)}" x2="${refNum(x2 + nx * tick)}" y2="${refNum(y2 + ny * tick)}"/>`
    + `<text class="s-reftxt" x="${refNum(mx)}" y="${refNum(my)}" text-anchor="middle" dominant-baseline="middle" font-size="${refNum(Math.max(4, fs * 0.78))}" transform="rotate(${refNum(rot)} ${refNum(mx)} ${refNum(my)})">${esc(label)}</text>`;
}

function refMark(x, y, fs) {
  const r = Math.max(3, fs * 0.24);
  return `<line x1="${refNum(x - r)}" y1="${refNum(y)}" x2="${refNum(x + r)}" y2="${refNum(y)}"/><line x1="${refNum(x)}" y1="${refNum(y - r)}" x2="${refNum(x)}" y2="${refNum(y + r)}"/>`;
}

function guidePlace(plan, view, wall) {
  const guide = planDrag || guideFocus;
  if (!guide || guide.kind === 'tag' || !plan) return null;
  if ((guide.view || 'plan') !== view) return null;
  if (view === 'elev' && guide.wall !== wall) return null;
  return dragPlace(guide, plan);
}

function refRoom(project, from, to, label, fs, t) {
  if (Math.hypot(to[0] - from[0], to[1] - from[1], to[2] - from[2]) < 6) return '';
  const [x1, y1] = project(from[0], from[1], from[2]);
  const [x2, y2] = project(to[0], to[1], to[2]);
  return refSeg(x1, y1, x2, y2, label, fs, t);
}

function planDragGuides(plan, place, fs) {
  if (!place) return '';
  const inset = fs * 1.2;
  let x = place.x;
  let y = place.y;
  if (!place.screenEdge) {
    if (x <= 12) x = inset;
    else if (x >= plan.W - 12) x = plan.W - inset;
    if (y <= plan.scr.y + 6) y = plan.scr.y + inset;
    else if (y >= plan.D - 12) y = plan.D - inset;
  }
  let html = refMark(place.screenEdge ? plan.W / 2 : place.x, place.screenEdge ? plan.scr.y : place.y, fs);
  if (place.screenEdge) {
    html += refSeg(plan.W / 2, 0, plan.W / 2, plan.scr.y, 'Back wall ' + ftin(plan.scr.y), fs);
    html += refSeg(0, plan.scr.y, plan.scr.x0, plan.scr.y, 'Left ' + ftin(plan.scr.x0), fs);
    html += refSeg(plan.scr.x1, plan.scr.y, plan.W, plan.scr.y, 'Right ' + ftin(plan.W - plan.scr.x1), fs);
    html += `<text class="s-reftxt" x="${plan.W / 2}" y="${plan.scr.y + fs * 1.2}" text-anchor="middle" font-size="${fs * 0.75}">Floor ${esc(ftin(place.z))}</text>`;
    return `<g class="s-ref">${html}</g>`;
  }
  html += refSeg(x, plan.scr.y, x, place.y, 'Screen ' + ftin(place.y - plan.scr.y), fs);
  html += refSeg(0, y, place.x, y, 'Left ' + ftin(place.x), fs);
  html += refSeg(place.x, y, plan.W, y, 'Right ' + ftin(plan.W - place.x), fs);
  if (place.z > 0.5) html += `<text class="s-reftxt" x="${x + fs * 0.45}" y="${place.y - fs * 0.35}" font-size="${fs * 0.75}">Floor ${esc(ftin(place.z))}</text>`;
  return `<g class="s-ref">${html}</g>`;
}

function elevDragGuides(plan, wall, place, fs) {
  if (!place) return '';
  const { W, D, H } = plan;
  const len = (wall === 'screen' || wall === 'rear') ? W : D;
  const U = (along) => (wall === 'screen' ? along : wall === 'rear' ? W - along : wall === 'left' ? D - along : along);
  const along = (wall === 'screen' || wall === 'rear') ? place.x : place.y;
  const sx = U(along);
  const sy = H - (place.z || 0);
  let html = refMark(sx, sy, fs);
  html += refSeg(sx, sy, sx, H, 'Floor ' + ftin(place.z || 0), fs);
  if (wall === 'left' || wall === 'right') {
    html += refSeg(U(plan.scr.y), sy, sx, sy, 'Screen ' + ftin(Math.abs(place.y - plan.scr.y)), fs);
    html += refSeg(sx, sy, U(D), sy, 'Rear ' + ftin(Math.abs(D - place.y)), fs);
  } else {
    html += refSeg(0, sy, sx, sy, 'Left ' + ftin(place.x), fs);
    html += refSeg(sx, sy, len, sy, 'Right ' + ftin(W - place.x), fs);
  }
  return `<g class="s-ref">${html}</g>`;
}

function perspDragGuides(plan, place, project, fs) {
  if (!place) return '';
  const gap = 8;
  let x = place.x;
  let y = place.y;
  const z = place.z || 0;
  if (x <= 12) x = gap;
  else if (x >= plan.W - 12) x = plan.W - gap;
  if (y >= plan.D - 12) y = plan.D - gap;
  const mark = project(place.x, place.y, z);
  let html = refMark(mark[0], mark[1], fs);
  html += refRoom(project, [x, y, z], [x, plan.scr.y, z], 'Screen ' + ftin(place.y - plan.scr.y), fs);
  html += refRoom(project, [x, y, z], [x, y, 0], 'Floor ' + ftin(z), fs);
  html += refRoom(project, [x, y, z], [gap, y, z], 'Left ' + ftin(place.x), fs);
  html += refRoom(project, [x, y, z], [plan.W - gap, y, z], 'Right ' + ftin(plan.W - place.x), fs);
  return `<g class="s-ref">${html}</g>`;
}

function tagPos(item, W, D, fs) {
  if (item.plan) return { x: clampIn(item.plan.x + item.plan.w + fs * 0.7, W), y: clampIn(item.plan.y - fs * 0.2, D) };
  if (item.wall === 'left') return { x: fs * 1.4, y: (item.a0 + item.a1) / 2 };
  if (item.wall === 'right') return { x: W - fs * 1.4, y: (item.a0 + item.a1) / 2 };
  return { x: (item.a0 + item.a1) / 2, y: D - fs * 1.4 };
}

function savedTag(id) {
  const tag = S.job && S.job.spec && S.job.spec.tags && S.job.spec.tags[id];
  if (!tag || !Number.isFinite(+tag.x) || !Number.isFinite(+tag.y)) return null;
  return { x: +tag.x, y: +tag.y };
}

function planSVG(plan, mode) {
  const { W, D } = plan;
  const pad = Math.max(W, D) * 0.16;
  const fs = Math.max(W, D) / 42;
  const centerX = W / 2;
  const occupied = [];
  const spread = (x, y) => {
    let px = x;
    let py = y;
    const towardX = Math.sign(centerX - x) || 0;
    const towardY = Math.sign(D / 2 - y) || -1;
    for (let n = 0; n < 14; n += 1) {
      const crowded = occupied.some((spot) => Math.hypot(spot.x - px, spot.y - py) < fs * 2.35);
      if (!crowded) break;
      px += towardX * fs * 0.45 + (n % 2 ? fs * 1.7 : -fs * 1.7);
      py += towardY * fs * 1.7;
    }
    px = Math.max(fs, Math.min(W - fs, px));
    py = Math.max(fs, Math.min(D - fs, py));
    occupied.push({ x: px, y: py });
    return { x: px, y: py };
  };
  const dragTag = (id, x, y, radius, color) => {
    const kept = savedTag(id);
    const pos = kept || spread(x, y);
    if (kept) occupied.push(pos);
    const handle = mode === 'builder'
      ? `<g class="s-drag" data-drag="tag" data-id="${esc(id)}" aria-label="${esc(id)} tag. Drag to move this label.">`
      : '';
    return handle + callout(pos.x, pos.y, id, radius, color) + (mode === 'builder' ? `<circle class="s-hit" cx="${pos.x}" cy="${pos.y}" r="${radius * 1.7}"/></g>` : '');
  };
  const dragOpen = (kind, label, extra = '') => (kind ? `<g class="s-drag" data-drag="${kind}" ${extra} aria-label="${esc(label)}">` : '');
  const dragClose = (kind) => (kind ? '</g>' : '');
  let markup = `<svg data-view="plan" viewBox="${[-pad, -pad, W + pad * 2, D + pad * 2].join(' ')}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Plan view">`;
  for (let x = 0; x <= W; x += 12) markup += `<line class="s-grid" x1="${x}" y1="0" x2="${x}" y2="${D}"/>`;
  for (let y = 0; y <= D; y += 12) markup += `<line class="s-grid" x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;
  const turfLeft = S.job.spec.turf === 'full' ? 0 : plan.scr.x0;
  const turfRight = S.job.spec.turf === 'full' ? W : plan.scr.x1;
  markup += `<rect class="s-turf" x="${turfLeft}" y="${plan.scr.y}" width="${turfRight - turfLeft}" height="${Math.max(0, D - plan.scr.y)}"/>`;
  if (mode === 'builder') markup += `<circle class="s-nofix" cx="${plan.nofix.x}" cy="${plan.nofix.y}" r="${plan.nofix.r}"/><text class="s-lblm" x="${plan.nofix.x}" y="${plan.nofix.y + plan.nofix.r - fs * 0.6}" text-anchor="middle" font-size="${fs * 0.75}">No ceiling fixtures in this ring</text>`;
  plan.panels.forEach((panel) => {
    if (panel.wall === 'ceiling') {
      markup += `<rect class="s-hushceil" x="${panel.x0}" y="${panel.y0}" width="${panel.x1 - panel.x0}" height="${panel.y1 - panel.y0}"/>`;
      return;
    }
    const thickness = 5;
    if (panel.wall === 'left') markup += `<rect class="s-hush" x="0" y="${panel.a0}" width="${thickness}" height="${Math.max(0.4, panel.a1 - panel.a0)}"/>`;
    else if (panel.wall === 'right') markup += `<rect class="s-hush" x="${W - thickness}" y="${panel.a0}" width="${thickness}" height="${Math.max(0.4, panel.a1 - panel.a0)}"/>`;
    else markup += `<rect class="s-hush" x="${panel.a0}" y="${D - thickness}" width="${Math.max(0.4, panel.a1 - panel.a0)}" height="${thickness}"/>`;
  });
  const mat = plan.mat;
  markup += `<line class="s-center" x1="${centerX}" y1="${plan.scr.y}" x2="${centerX}" y2="${D}"/>`;
  markup += dragOpen('ball', 'Hitting mat. Drag to place the ball. Ball-to-screen and the center offset update.');
  markup += `<rect class="s-mat" x="${mat.x}" y="${mat.y}" width="${mat.w}" height="${mat.d}"/>`;
  if (S.job.spec.matCutout) markup += `<rect class="s-matcut" x="${mat.x - 1}" y="${mat.y - 1}" width="${mat.w + 2}" height="${mat.d + 2}"/>`;
  markup += `<circle class="s-ball" cx="${plan.ball.x}" cy="${plan.ball.y}" r="3"/>`;
  markup += `<rect class="s-hit" x="${mat.x}" y="${mat.y}" width="${mat.w}" height="${mat.d}"/>`;
  markup += dragClose('ball');
  markup += `<rect class="s-screen" x="${plan.scr.x0}" y="${plan.scr.y - 1.5}" width="${plan.scr.w}" height="3"/>`;
  markup += dragOpen('screen', 'Screen. Drag toward or away from the ball. The screen offset and ball-to-screen update.');
  markup += `<rect class="s-hit" x="${plan.scr.x0}" y="${plan.scr.y - 8}" width="${plan.scr.w}" height="16"/>`;
  markup += dragClose('screen');
  if (mode !== 'builder') markup += `<polygon class="s-throw" points="${plan.pj.x},${plan.pj.y} ${plan.img.x0},${plan.scr.y} ${plan.img.x1},${plan.scr.y}"/>`;
  if (mode !== 'builder') {
    plan.golfers.forEach((golfer) => {
      markup += `<circle class="s-swing" cx="${golfer.x}" cy="${golfer.y}" r="${plan.swingR}"/><ellipse class="s-golfer" cx="${golfer.x}" cy="${golfer.y}" rx="9" ry="14"/>`;
    });
  }
  const cabinet = plan.cab;
  let cabinetRect;
  if (cabinet.wall === 'rear') cabinetRect = { x: cabinet.a - cabinet.w / 2, y: D - cabinet.d, w: cabinet.w, h: cabinet.d };
  else if (cabinet.wall === 'left') cabinetRect = { x: 0, y: cabinet.a - cabinet.w / 2, w: cabinet.d, h: cabinet.w };
  else cabinetRect = { x: W - cabinet.d, y: cabinet.a - cabinet.w / 2, w: cabinet.d, h: cabinet.w };
  markup += dragOpen('cab', 'Computer cabinet. Drag along its wall. The wall offset updates.');
  markup += `<rect class="s-equip" x="${cabinetRect.x}" y="${cabinetRect.y}" width="${cabinetRect.w}" height="${cabinetRect.h}"/>`;
  markup += `<rect class="s-hit" x="${cabinetRect.x}" y="${cabinetRect.y}" width="${cabinetRect.w}" height="${cabinetRect.h}"/>`;
  markup += dragClose('cab');
  const wallRect = (wall, along, width, thickness) => {
    if (wall === 'left') return { x: 0, y: along - width / 2, w: thickness, h: width };
    if (wall === 'right') return { x: W - thickness, y: along - width / 2, w: thickness, h: width };
    if (wall === 'rear') return { x: along - width / 2, y: D - thickness, w: width, h: thickness };
    return { x: along - width / 2, y: 0, w: width, h: thickness };
  };
  plan.tvs.forEach((tv, index) => {
    const rect = wallRect(tv.wall, tv.a, tv.w, 5);
    markup += dragOpen('tv', `TV ${index + 1}. Drag along the wall. Its position updates.`, `data-i="${index}"`);
    markup += `<rect class="s-tv" x="${rect.x}" y="${rect.y}" width="${rect.w}" height="${rect.h}"/>`;
    markup += `<rect class="s-hit" x="${rect.x - 4}" y="${rect.y - 4}" width="${rect.w + 8}" height="${rect.h + 8}"/>`;
    markup += dragClose('tv');
  });
  if (plan.mon && !plan.mon.onCab) {
    const rect = wallRect(plan.mon.wall, plan.mon.a, plan.mon.w, 4);
    markup += dragOpen('mon', 'Monitor. Drag along the wall. Its position updates.');
    markup += `<rect class="s-tv" x="${rect.x}" y="${rect.y}" width="${rect.w}" height="${rect.h}"/>`;
    markup += `<rect class="s-hit" x="${rect.x - 4}" y="${rect.y - 4}" width="${rect.w + 8}" height="${rect.h + 8}"/>`;
    markup += dragClose('mon');
  }
  const launch = plan.lm;
  const launchOnCenter = launch.mount === 'ceiling' || launch.type === 'radar';
  markup += dragOpen(launchOnCenter ? 'lm' : '', launchOnCenter ? 'Launch monitor. Stays on the target line with the ball. Drag toward or away from the screen.' : '');
  markup += `<rect class="${launch.mount === 'ceiling' ? 's-equip' : 's-equipfill'}" x="${launch.x - launch.w / 2}" y="${launch.y - launch.d / 2}" width="${launch.w}" height="${launch.d}" ${launch.mount === 'ceiling' ? 'stroke-dasharray="3 2"' : ''}/>`;
  if (launchOnCenter) markup += `<rect class="s-hit" x="${launch.x - launch.w / 2 - 4}" y="${launch.y - launch.d / 2 - 4}" width="${launch.w + 8}" height="${launch.d + 8}"/>`;
  markup += dragClose(launchOnCenter ? 'lm' : '');
  markup += dragOpen('proj', 'Projector. Stays centered on the screen. Drag toward or away from the screen to set the throw.');
  markup += `<rect class="s-equip" x="${plan.pj.x - 10}" y="${plan.pj.y - 8}" width="20" height="16" stroke-dasharray="3 2"/><circle class="s-equipfill" cx="${plan.pj.x}" cy="${plan.pj.y - 8}" r="3"/>`;
  markup += `<rect class="s-hit" x="${plan.pj.x - 14}" y="${plan.pj.y - 12}" width="28" height="24"/>`;
  markup += dragClose('proj');
  if (mode === 'builder') {
    plan.backing.forEach((item) => {
      if (item.plan) markup += `<rect class="s-backing" x="${item.plan.x}" y="${item.plan.y}" width="${item.plan.w}" height="${item.plan.d}"/>`;
      else if (item.wall) {
        const thickness = 7;
        const rect = item.wall === 'left'
          ? { x: -thickness, y: item.a0, w: thickness, h: item.a1 - item.a0 }
          : item.wall === 'right'
            ? { x: W, y: item.a0, w: thickness, h: item.a1 - item.a0 }
            : { x: item.a0, y: D, w: item.a1 - item.a0, h: thickness };
        markup += `<rect class="s-backing" x="${rect.x}" y="${rect.y}" width="${rect.w}" height="${rect.h}"/>`;
      }
    });
    plan.tubes.forEach((tube) => { markup += `<polyline class="s-tube" points="${tube.pts.map((point) => point.join(',')).join(' ')}"/>`; });
    plan.elec.forEach((item) => { markup += elecSym(item.x, item.y, fs * 0.55, item.mount, item.note); });
    plan.data.forEach((item) => { markup += `<polygon class="s-data" points="${item.x},${item.y - fs * 0.45} ${item.x + fs * 0.4},${item.y + fs * 0.3} ${item.x - fs * 0.4},${item.y + fs * 0.3}"/>`; });
    plan.backing.forEach((item) => {
      const pos = tagPos(item, W, D, fs);
      markup += dragTag(item.id, pos.x, pos.y, fs * 0.62, 'var(--backing)');
    });
    plan.elec.forEach((item) => { markup += dragTag(item.id, clampIn(item.x + fs * 1.1, W), clampIn(item.y - fs * 0.9, D), fs * 0.55, 'var(--elec)'); });
  }
  markup += `<rect class="s-wall" x="0" y="0" width="${W}" height="${D}"/>`;
  markup += `<text class="s-lbl" x="${W / 2}" y="${-pad * 0.62}" text-anchor="middle" font-size="${fs}">SCREEN WALL</text>`;
  if (mode === 'sales') {
    markup += `<text class="s-lblm" x="${plan.ball.x}" y="${mat.y + mat.d + fs * 1.3}" text-anchor="middle" font-size="${fs * 0.8}">Hitting mat</text>`;
    markup += `<text class="s-lblm" x="${plan.pj.x + 14}" y="${plan.pj.y + 4}" font-size="${fs * 0.75}">Projector</text>`;
  }
  markup += dimH(0, W, -pad * 0.32, ftin(W), fs);
  markup += dimV(0, D, W + pad * 0.32, ftin(D), fs);
  if (mode !== 'builder') {
    const side = S.job.spec.handed === 'LH' ? -1 : 1;
    markup += dimV(plan.scr.y, plan.ball.y, plan.ball.x - side * (mat.w / 2 + fs * 1.6), 'Ball ' + ftin(plan.ball.y - plan.scr.y), fs * 0.85);
    markup += dimV(plan.scr.y, plan.pj.y, plan.pj.x + mat.w / 2 + fs * 3.2, 'Throw ' + ftin(plan.pj.y - plan.scr.y), fs * 0.85);
  }
  if (mode === 'installer') {
    markup += dimH(0, plan.ball.x, D + pad * 0.32, 'Ball X ' + ftin(plan.ball.x), fs * 0.85);
    markup += dimV(0, plan.scr.y, -pad * 0.32, ftin(plan.scr.y), fs * 0.8);
    placements(plan).forEach((item, index) => {
      if (item.px != null) markup += callout(clampIn(item.px + fs, W), clampIn(item.py - fs, D), index + 1, fs * 0.62, 'var(--ink)');
    });
  }
  markup += `<text class="s-lblm" x="${-pad * 0.62}" y="${D / 2}" text-anchor="middle" font-size="${fs * 0.8}" transform="rotate(-90 ${-pad * 0.62} ${D / 2})">LEFT WALL</text>`;
  markup += `<text class="s-lblm" x="${W + pad * 0.7}" y="${D / 2}" text-anchor="middle" font-size="${fs * 0.8}" transform="rotate(90 ${W + pad * 0.7} ${D / 2})">RIGHT WALL</text>`;
  markup += `<text class="s-lblm" x="${W / 2}" y="${D + pad * 0.75}" text-anchor="middle" font-size="${fs * 0.8}">REAR WALL · scale 1 sq = 1 ft</text>`;
  plan.lights.forEach((light, index) => {
    markup += `<rect class="s-light" x="0" y="${light.y - 1.5}" width="${W}" height="3"/>`;
    markup += `<text class="s-lightnum" x="${fs}" y="${light.y - fs * 0.35}" font-size="${fs * 0.62}">${index + 1}</text>`;
  });
  plan.soffits.forEach((s, index) => {
    const where = soffitWhere(s.face).toLowerCase();
    let x0 = s.x0;
    let y0 = s.y0;
    let x1 = s.x1;
    let y1 = s.y1;
    if (s.face === 'left') x1 = Math.max(x1, x0 + 16);
    else if (s.face === 'right') x0 = Math.min(x0, x1 - 16);
    else if (s.face === 'screen') y1 = Math.max(y1, y0 + 16);
    if (x1 - x0 < 16) { const mid = (x0 + x1) / 2; x0 = mid - 8; x1 = mid + 8; }
    if (y1 - y0 < 16) { const mid = (y0 + y1) / 2; y0 = mid - 8; y1 = mid + 8; }
    let tx = s.cx;
    let ty = s.cy;
    let anchor = 'middle';
    if (s.face === 'left') { tx = s.x1 + fs * 0.35; anchor = 'start'; }
    else if (s.face === 'right') { tx = s.x0 - fs * 0.35; anchor = 'end'; }
    else if (s.face === 'screen') ty = Math.max(s.y1 + fs * 0.55, s.cy);
    markup += dragOpen('soffit', `Soffit ${index + 1}. Drag it along the ${where}. The size stays as entered.`, `data-i="${index}"`);
    markup += `<rect class="s-soffit" x="${s.x0}" y="${s.y0}" width="${Math.max(1, s.x1 - s.x0)}" height="${Math.max(1, s.y1 - s.y0)}"/>`;
    markup += `<text class="s-soffitnum" x="${tx}" y="${ty}" text-anchor="${anchor}" dominant-baseline="middle" font-size="${fs * 0.7}">${index + 1}</text>`;
    markup += `<rect class="s-hit" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}"/>`;
    markup += dragClose('soffit');
  });
  plan.cups.forEach((cup, index) => {
    const radius = mode === 'sales' ? 3.4 : 2.6;
    markup += dragOpen('cup', `Putting cup ${index + 1}. Drag it to the spot where the cup is cut into the turf.`, `data-i="${index}"`);
    markup += `<circle class="s-cup" cx="${cup.x}" cy="${cup.y}" r="${radius}"/>`;
    markup += `<text class="s-cupnum" x="${cup.x + radius + fs * 0.15}" y="${cup.y + fs * 0.22}" font-size="${fs * 0.62}">${index + 1}</text>`;
    markup += `<circle class="s-hit" cx="${cup.x}" cy="${cup.y}" r="${Math.max(11, fs * 0.9)}"/>`;
    markup += dragClose('cup');
  });
  const draggedPlan = guidePlace(plan, 'plan');
  if (draggedPlan) markup += planDragGuides(plan, draggedPlan, fs);
  return markup + '</svg>';
}

function soffitElevBands(plan, wall) {
  const bands = [];
  (plan.soffits || []).forEach((s, index) => {
    let a0 = null;
    let a1 = null;
    let drag = false;
    if (s.face === 'ceiling' || s.face === 'floor') {
      if (wall === 'screen' || wall === 'rear') { a0 = s.x0; a1 = s.x1; }
      else { a0 = s.y0; a1 = s.y1; }
      drag = true;
    } else if (s.face === wall && wall !== 'rear') {
      a0 = wall === 'left' || wall === 'right' ? s.y0 : s.x0;
      a1 = wall === 'left' || wall === 'right' ? s.y1 : s.x1;
      drag = true;
    } else if ((wall === 'left' || wall === 'right') && s.face === 'screen') {
      a0 = s.y0;
      a1 = s.y1;
    } else if (wall === 'screen' && (s.face === 'left' || s.face === 'right')) {
      a0 = s.x0;
      a1 = s.x1;
    }
    if (a0 == null) return;
    bands.push({ index, a0, a1, z0: s.z0, z1: s.z1, drag, face: s.face });
  });
  return bands;
}

function elevSVG(plan, wall, mode) {
  const { W, D, H } = plan;
  const len = (wall === 'screen' || wall === 'rear') ? W : D;
  const U = (along) => (wall === 'screen' ? along : wall === 'rear' ? W - along : wall === 'left' ? D - along : along);
  const Z = (z) => H - z;
  const pad = Math.max(len, H) * 0.14;
  const fs = Math.max(len, H) / 38;
  let markup = `<svg data-view="elev" data-wall="${wall}" viewBox="${-pad} ${-pad} ${len + pad * 2} ${H + pad * 2}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(wall)} wall elevation">`;
  for (let x = 0; x <= len; x += 16) markup += `<line class="s-stud" x1="${x}" y1="0" x2="${x}" y2="${H}"/>`;
  if (wall === 'left' || wall === 'right') {
    const screenX = U(plan.scr.y);
    markup += `<line class="s-screen" x1="${screenX}" y1="${Z(plan.scr.z1)}" x2="${screenX}" y2="${Z(plan.scr.z0)}"/><text class="s-lblm" x="${screenX + (wall === 'left' ? -4 : 4)}" y="${Z(plan.scr.z1) + fs}" text-anchor="${wall === 'left' ? 'end' : 'start'}" font-size="${fs * 0.7}">Screen</text>`;
    markup += `<rect class="s-turf" x="${Math.min(U(plan.scr.y), U(D))}" y="${H - 2}" width="${Math.abs(U(D) - U(plan.scr.y))}" height="2"/>`;
    const projectorX = U(plan.pj.y);
    markup += `<rect class="s-equip" x="${projectorX - 10}" y="${Z(plan.pj.z)}" width="20" height="8" stroke-dasharray="3 2"/><line class="s-zone" x1="${projectorX}" y1="0" x2="${projectorX}" y2="${Z(plan.pj.z)}"/>`;
    if (mode !== 'builder') markup += `<text class="s-lblm" x="${projectorX}" y="${Z(plan.pj.z) + fs * 1.6}" text-anchor="middle" font-size="${fs * 0.65}">Projector (section)</text>`;
    if (plan.lm.mount === 'ceiling') {
      const launchX = U(plan.lm.y);
      markup += `<rect class="s-equip" x="${launchX - 7}" y="${Z(plan.lm.z)}" width="14" height="5" stroke-dasharray="3 2"/>`;
    } else {
      const launchX = U(plan.lm.y);
      markup += `<rect class="s-equipfill" x="${launchX - 5}" y="${Z(6)}" width="10" height="6"/>`;
    }
    if (mode !== 'builder') {
      const ballX = U(plan.ball.y);
      markup += `<line class="s-swing" x1="${ballX - plan.swingR * 0.6}" y1="${Z(plan.needH)}" x2="${ballX + plan.swingR * 0.6}" y2="${Z(plan.needH)}"/><text class="s-lblm" x="${ballX}" y="${Z(plan.needH) - fs * 0.4}" text-anchor="middle" font-size="${fs * 0.65}">Est. swing height ${ftin(plan.needH)}</text>`;
    }
  }
  if (wall === 'screen') {
    markup += `<rect class="s-screen" x="${plan.scr.x0}" y="${Z(plan.scr.z1)}" width="${plan.scr.w}" height="${plan.scr.h}" style="stroke-width:2"/>`;
    markup += `<rect class="s-image" x="${plan.img.x0}" y="${Z(plan.img.z1)}" width="${plan.img.w}" height="${plan.img.h}"/>`;
    markup += `<text class="s-lblm" x="${W / 2}" y="${Z(plan.img.z1) + fs * 1.3}" text-anchor="middle" font-size="${fs * 0.75}">Projected image ${ftin(plan.img.w)} × ${ftin(plan.img.h)} (${esc(S.job.spec.aspect)})</text>`;
  }
  plan.panels.filter((panel) => panel.wall === wall).forEach((panel) => {
    const x0 = Math.min(U(panel.a0), U(panel.a1));
    const x1 = Math.max(U(panel.a0), U(panel.a1));
    markup += `<rect class="s-hush" x="${x0}" y="${Z(panel.z1)}" width="${Math.max(0.4, x1 - x0)}" height="${Math.max(0.4, panel.z1 - panel.z0)}"/>`;
  });
  if (wall === 'left' || wall === 'right' || wall === 'screen') {
    const seen = new Set();
    plan.panels.filter((panel) => panel.wall === 'ceiling').forEach((panel) => {
      if (wall === 'screen') {
        const key = panel.x0.toFixed(1);
        if (seen.has(key)) return;
        seen.add(key);
        markup += `<rect class="s-hush" x="${panel.x0}" y="0" width="${Math.max(0.4, panel.x1 - panel.x0)}" height="4"/>`;
      } else {
        const key = panel.y0.toFixed(1);
        if (seen.has(key)) return;
        seen.add(key);
        const x0 = Math.min(U(panel.y0), U(panel.y1));
        const x1 = Math.max(U(panel.y0), U(panel.y1));
        markup += `<rect class="s-hush" x="${x0}" y="0" width="${Math.max(0.4, x1 - x0)}" height="4"/>`;
      }
    });
  }
  if (plan.cab.wall === wall) {
    const x = U(plan.cab.a);
    markup += `<rect class="s-equip" x="${x - plan.cab.w / 2}" y="${Z(plan.cab.h)}" width="${plan.cab.w}" height="${plan.cab.h}"/><text class="s-lblm" x="${x}" y="${Z(plan.cab.h / 2)}" text-anchor="middle" font-size="${fs * 0.65}">PC cabinet</text>`;
  }
  plan.tvs.filter((tv) => tv.wall === wall).forEach((tv) => {
    const x = U(tv.a);
    markup += `<rect class="s-tv" x="${x - tv.w / 2}" y="${Z(tv.z + tv.h / 2)}" width="${tv.w}" height="${tv.h}"/>`;
  });
  if (plan.mon && plan.mon.wall === wall) {
    const x = U(plan.mon.a);
    markup += `<rect class="s-tv" x="${x - plan.mon.w / 2}" y="${Z(plan.mon.z + plan.mon.h / 2)}" width="${plan.mon.w}" height="${plan.mon.h}"/>`;
  }
  if (mode === 'builder') {
    plan.backing.filter((item) => item.wall === wall).forEach((item) => {
      const x0 = Math.min(U(item.a0), U(item.a1));
      const x1 = Math.max(U(item.a0), U(item.a1));
      if (item.rows) item.rows.forEach((row) => { markup += `<rect class="s-backing" x="${x0}" y="${Z(row + 1.75)}" width="${x1 - x0}" height="3.5"/>`; });
      else markup += `<rect class="s-backing" x="${x0}" y="${Z(item.z1)}" width="${x1 - x0}" height="${item.z1 - item.z0}"/>`;
      markup += callout(Math.min(len - 6, x1 + fs * 0.9), Z(item.z1) + fs * 0.2, item.id, fs * 0.55, 'var(--backing)');
    });
    if (wall === 'left' || wall === 'right') {
      plan.backing.filter((item) => item.plan).forEach((item) => {
        const x0 = Math.min(U(item.plan.y), U(item.plan.y + item.plan.d));
        const x1 = Math.max(U(item.plan.y), U(item.plan.y + item.plan.d));
        markup += `<rect class="s-backing" x="${x0}" y="0" width="${Math.max(0, x1 - x0)}" height="7"/>`;
      });
    }
    if (wall === 'screen') plan.backing.filter((item) => item.id === 'B1').forEach(() => { markup += `<rect class="s-backing" x="0" y="0" width="${W}" height="7"/>`; });
    plan.elec.filter((item) => item.wall === wall).forEach((item) => {
      const x = U(item.a);
      markup += elecSym(x, Z(item.z), fs * 0.5, 'wall') + `<text class="s-dimtxt" x="${x}" y="${Z(item.z) + fs * 1.3}" text-anchor="middle" font-size="${fs * 0.6}">${esc(item.id)} @ ${ftin(item.z)} AFF</text>`;
    });
    plan.data.filter((item) => item.wall === wall).forEach((item) => {
      const x = U(item.a);
      markup += `<polygon class="s-data" points="${x},${Z(item.z) - fs * 0.4} ${x + fs * 0.36},${Z(item.z) + fs * 0.3} ${x - fs * 0.36},${Z(item.z) + fs * 0.3}"/>`;
    });
    if (plan.cab.wall === wall) {
      const x = U(plan.cab.a);
      markup += `<line class="s-tube" x1="${x - 6}" y1="0" x2="${x - 6}" y2="${Z(18)}"/><text class="s-dimtxt" x="${x - 6 + fs * 0.4}" y="${fs * 1.4}" font-size="${fs * 0.6}">2" tech tubes</text>`;
    }
    plan.tvs.filter((tv) => tv.wall === wall).forEach((tv) => {
      const x = U(tv.a) + 6;
      markup += `<line class="s-tube" x1="${x}" y1="${Z(tv.z)}" x2="${x}" y2="0"/>`;
    });
  }
  const elevHit = (kind, label, rx, ry, rw, rh, extra = '') => {
    markup += `<g class="s-drag" data-drag="${kind}" ${extra} aria-label="${esc(label)}"><rect class="s-hit" x="${rx}" y="${ry}" width="${Math.max(8, rw)}" height="${Math.max(8, rh)}"/></g>`;
  };
  if (wall === 'left' || wall === 'right') {
    plan.cups.forEach((cup, index) => {
      const cupX = U(cup.y);
      markup += `<circle class="s-cup" cx="${cupX}" cy="${H - 4}" r="3.2"/><text class="s-cupnum" x="${cupX}" y="${H - 10}" text-anchor="middle" font-size="${fs * 0.55}">${index + 1}</text>`;
      elevHit('cup', `Putting cup ${index + 1}. Drag it along the floor.`, cupX - 12, H - 18, 24, 18, `data-i="${index}"`);
    });
    elevHit('ball', 'Ball. Drag toward or away from the screen. Ball-to-screen updates.', U(plan.ball.y) - 12, H - 18, 24, 18);
    elevHit('proj', 'Projector. Drag to set the throw and the mount drop.', U(plan.pj.y) - 14, Z(plan.pj.z) - 2, 28, 14);
    if (plan.lm.mount === 'ceiling' || plan.lm.type === 'radar') elevHit('lm', 'Launch monitor. Drag toward or away from the screen.', U(plan.lm.y) - 10, Z(plan.lm.z) - 2, 20, 12);
  }
  if (plan.cab.wall === wall) {
    const cabX = U(plan.cab.a);
    elevHit('cab', 'Computer cabinet. Drag along the wall. The wall offset updates.', cabX - plan.cab.w / 2, Z(plan.cab.h), plan.cab.w, plan.cab.h);
  }
  plan.tvs.forEach((tv, index) => {
    if (tv.wall !== wall) return;
    const tvX = U(tv.a);
    elevHit('tv', `TV ${index + 1}. Drag along the wall or up and down. Position and height update.`, tvX - tv.w / 2, Z(tv.z + tv.h / 2), tv.w, tv.h, `data-i="${index}"`);
  });
  if (plan.mon && !plan.mon.onCab && plan.mon.wall === wall) {
    const monX = U(plan.mon.a);
    elevHit('mon', 'Monitor. Drag along the wall or up and down. Position and height update.', monX - plan.mon.w / 2, Z(plan.mon.z + plan.mon.h / 2), plan.mon.w, plan.mon.h);
  }
  if (wall === 'left' || wall === 'right') {
    plan.lights.forEach((light, index) => {
      const x = U(light.y);
      markup += `<rect class="s-light" x="${x - 1.6}" y="0" width="3.2" height="${H}"/>`;
      markup += `<text class="s-lightnum" x="${x + 4}" y="${fs * 1.2}" font-size="${fs * 0.55}">${index + 1}</text>`;
    });
  }
  soffitElevBands(plan, wall).forEach((band) => {
    const x0 = Math.min(U(band.a0), U(band.a1));
    const x1 = Math.max(U(band.a0), U(band.a1));
    markup += `<rect class="s-soffit" x="${x0}" y="${Z(band.z1)}" width="${Math.max(1, x1 - x0)}" height="${Math.max(1, band.z1 - band.z0)}"/>`;
    markup += `<text class="s-soffitnum" x="${(x0 + x1) / 2}" y="${Z((band.z0 + band.z1) / 2)}" text-anchor="middle" dominant-baseline="middle" font-size="${fs * 0.62}">${band.index + 1}</text>`;
    if (band.drag) elevHit('soffit', `Soffit ${band.index + 1}. Drag it along the ${soffitWhere(band.face).toLowerCase()}. The size stays as entered.`, x0, Z(band.z1), Math.max(16, x1 - x0), Math.max(12, band.z1 - band.z0), `data-i="${band.index}"`);
  });
  markup += `<line class="s-wall" x1="0" y1="${H}" x2="${len}" y2="${H}"/><rect class="s-wallthin" x="0" y="0" width="${len}" height="${H}"/>`;
  markup += dimH(0, len, -pad * 0.35, ftin(len), fs);
  markup += dimV(0, H, len + pad * 0.35, ftin(H) + ' clg', fs);
  if (wall === 'screen') markup += dimV(Z(plan.scr.z1), Z(plan.scr.z0), -pad * 0.35, 'Screen ' + ftin(plan.scr.h), fs * 0.85) + dimH(plan.scr.x0, plan.scr.x1, H + pad * 0.35, 'Screen ' + ftin(plan.scr.w), fs * 0.85);
  plan.tvs.filter((tv) => tv.wall === wall).forEach((tv) => { markup += dimV(Z(tv.z), H, U(tv.a) + tv.w / 2 + fs * 0.7, ftin(tv.z) + ' ctr', fs * 0.75); });
  const names = { screen: 'SCREEN WALL — looking at screen', left: 'LEFT WALL — screen at right', right: 'RIGHT WALL — screen at left', rear: 'REAR WALL — looking back' };
  markup += `<text class="s-lbl" x="0" y="${H + pad * 0.72}" font-size="${fs * 0.9}">${names[wall]}</text>`;
  markup += elevDragGuides(plan, wall, guidePlace(plan, 'elev', wall), fs);
  return markup + '</svg>';
}

function perspectiveSVG(plan) {
  const { W, D, H } = plan;
  const camY = D + 70;
  const camX = W / 2 + (S.job.spec.handed === 'LH' ? -10 : 10);
  const camZ = H * 0.58;
  const project = (x, y, z) => {
    const depth = Math.max(8, camY - y);
    return [(x - camX) / depth * 1000, -(z - camZ) / depth * 1000];
  };
  const poly = (points, cls, extra = '') => `<polygon class="${cls}" ${extra} points="${points.map((point) => project(...point).map((value) => value.toFixed(1)).join(',')).join(' ')}"/>`;
  const corners = [[0, D, 0], [W, D, 0], [0, D, H], [W, D, H], [0, 0, 0], [W, 0, H]].map((point) => project(...point));
  const xs = corners.map((point) => point[0]);
  const ys = corners.map((point) => point[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const pad = (maxX - minX) * 0.1;
  let markup = `<svg data-view="persp" data-camx="${camX}" data-camy="${camY}" data-camz="${camZ}" viewBox="${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rendered view of the simulator bay"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--sky1)"/><stop offset="1" stop-color="var(--sky2)"/></linearGradient><pattern id="turfp" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" class="s-floor"/><path d="M0 6 L3 0" class="s-stud" style="stroke:var(--turf2);opacity:.5"/></pattern></defs>`;
  markup += poly([[0, 0, H], [W, 0, H], [W, D, H], [0, D, H]], 's-ceil');
  plan.panels.filter((panel) => panel.wall === 'ceiling').forEach((panel) => {
    markup += poly([[panel.x0, panel.y0, H - 0.4], [panel.x1, panel.y0, H - 0.4], [panel.x1, panel.y1, H - 0.4], [panel.x0, panel.y1, H - 0.4]], 's-hush', 'style="stroke-width:2.4"');
  });
  markup += poly([[0, 0, 0], [0, D, 0], [0, D, H], [0, 0, H]], 's-side');
  markup += poly([[W, 0, 0], [W, D, 0], [W, D, H], [W, 0, H]], 's-side2');
  markup += poly([[0, 0, 0], [W, 0, 0], [W, 0, H], [0, 0, H]], 's-side2');
  markup += poly([[0, plan.scr.y, 0], [W, plan.scr.y, 0], [W, D, 0], [0, D, 0]], 's-floor', 'fill="url(#turfp)"');
  plan.panels.forEach((panel) => {
    if (panel.wall === 'left') markup += poly([[0.8, panel.a0, panel.z0], [0.8, panel.a1, panel.z0], [0.8, panel.a1, panel.z1], [0.8, panel.a0, panel.z1]], 's-hush', 'style="stroke-width:2"');
    if (panel.wall === 'right') markup += poly([[W - 0.8, panel.a0, panel.z0], [W - 0.8, panel.a1, panel.z0], [W - 0.8, panel.a1, panel.z1], [W - 0.8, panel.a0, panel.z1]], 's-hush', 'style="stroke-width:2"');
  });
  plan.tvs.forEach((tv) => {
    if (tv.wall === 'left' || tv.wall === 'right') {
      const x = tv.wall === 'left' ? 1 : W - 1;
      markup += poly([[x, tv.a - tv.w / 2, tv.z - tv.h / 2], [x, tv.a + tv.w / 2, tv.z - tv.h / 2], [x, tv.a + tv.w / 2, tv.z + tv.h / 2], [x, tv.a - tv.w / 2, tv.z + tv.h / 2]], 's-tv');
    }
  });
  if (plan.mon && !plan.mon.onCab && plan.mon.wall !== 'rear') {
    const x = plan.mon.wall === 'left' ? 1 : W - 1;
    markup += poly([[x, plan.mon.a - plan.mon.w / 2, plan.mon.z - plan.mon.h / 2], [x, plan.mon.a + plan.mon.w / 2, plan.mon.z - plan.mon.h / 2], [x, plan.mon.a + plan.mon.w / 2, plan.mon.z + plan.mon.h / 2], [x, plan.mon.a - plan.mon.w / 2, plan.mon.z + plan.mon.h / 2]], 's-tv');
  }
  const screen = plan.scr;
  const image = plan.img;
  const screenY = screen.y;
  markup += poly([[screen.x0, screenY, screen.z0], [screen.x1, screenY, screen.z0], [screen.x1, screenY, screen.z1], [screen.x0, screenY, screen.z1]], 's-screen');
  const [ix0, iz1] = project(image.x0, screenY, image.z1);
  const [ix1, iz0] = project(image.x1, screenY, image.z0);
  const iw = ix1 - ix0;
  const ih = iz0 - iz1;
  markup += `<rect class="s-sky" x="${ix0}" y="${iz1}" width="${iw}" height="${ih}"/>`;
  markup += `<path class="s-hill" d="M${ix0} ${iz1 + ih * 0.62} Q${ix0 + iw * 0.25} ${iz1 + ih * 0.48} ${ix0 + iw * 0.5} ${iz1 + ih * 0.58} T${ix1} ${iz1 + ih * 0.55} L${ix1} ${iz0} L${ix0} ${iz0}Z"/>`;
  markup += `<path class="s-fairway" d="M${ix0 + iw * 0.3} ${iz0} L${ix0 + iw * 0.47} ${iz1 + ih * 0.62} L${ix0 + iw * 0.55} ${iz1 + ih * 0.62} L${ix0 + iw * 0.75} ${iz0}Z"/>`;
  markup += `<line class="s-pole" x1="${ix0 + iw * 0.51}" y1="${iz1 + ih * 0.63}" x2="${ix0 + iw * 0.51}" y2="${iz1 + ih * 0.53}"/><polygon class="s-flag" points="${ix0 + iw * 0.51},${iz1 + ih * 0.53} ${ix0 + iw * 0.535},${iz1 + ih * 0.55} ${ix0 + iw * 0.51},${iz1 + ih * 0.57}"/>`;
  const mat = plan.mat;
  markup += poly([[mat.x, mat.y, 0.5], [mat.x + mat.w, mat.y, 0.5], [mat.x + mat.w, mat.y + mat.d, 0.5], [mat.x, mat.y + mat.d, 0.5]], 's-mat');
  const cabinet = plan.cab;
  if (cabinet.wall !== 'rear') {
    const x0 = cabinet.wall === 'left' ? 0 : W - cabinet.d;
    const x1 = cabinet.wall === 'left' ? cabinet.d : W;
    const y0 = cabinet.a - cabinet.w / 2;
    const y1 = cabinet.a + cabinet.w / 2;
    markup += poly([[x0, y0, cabinet.h], [x1, y0, cabinet.h], [x1, y1, cabinet.h], [x0, y1, cabinet.h]], 's-equip');
    const face = cabinet.wall === 'left' ? x1 : x0;
    markup += poly([[face, y0, 0], [face, y1, 0], [face, y1, cabinet.h], [face, y0, cabinet.h]], 's-equip');
  }
  const launch = plan.lm;
  if (launch.mount === 'ceiling') markup += poly([[launch.x - 7, launch.y - 5, H - 6], [launch.x + 7, launch.y - 5, H - 6], [launch.x + 7, launch.y + 5, H - 6], [launch.x - 7, launch.y + 5, H - 6]], 's-equipfill');
  else markup += poly([[launch.x - 5, launch.y - 6, 6], [launch.x + 5, launch.y - 6, 6], [launch.x + 5, launch.y + 6, 0.5], [launch.x - 5, launch.y + 6, 0.5]], 's-equipfill');
  const projector = plan.pj;
  if (projector.y < camY - 20) {
    markup += poly([[projector.x - 10, projector.y - 8, projector.z - 7], [projector.x + 10, projector.y - 8, projector.z - 7], [projector.x + 10, projector.y + 8, projector.z - 7], [projector.x - 10, projector.y + 8, projector.z - 7]], 's-equipfill');
    const [mountX, mountY] = project(projector.x, projector.y, H);
    const [bodyX, bodyY] = project(projector.x, projector.y, projector.z - 7);
    markup += `<line class="s-pole" x1="${mountX}" y1="${mountY}" x2="${bodyX}" y2="${bodyY}" style="stroke-width:2"/>`;
  }
  plan.soffits.forEach((s, index) => {
    if (s.face === 'floor') {
      markup += poly([[s.x0, s.y0, s.z1], [s.x1, s.y0, s.z1], [s.x1, s.y1, s.z1], [s.x0, s.y1, s.z1]], 's-soffit');
      markup += poly([[s.x0, s.y1, 0], [s.x1, s.y1, 0], [s.x1, s.y1, s.z1], [s.x0, s.y1, s.z1]], 's-soffit');
      markup += poly([[s.x0, s.y0, 0], [s.x0, s.y1, 0], [s.x0, s.y1, s.z1], [s.x0, s.y0, s.z1]], 's-soffit');
      markup += poly([[s.x1, s.y0, 0], [s.x1, s.y1, 0], [s.x1, s.y1, s.z1], [s.x1, s.y0, s.z1]], 's-soffit');
    } else {
      const bottom = [[s.x0, s.y0, s.z0], [s.x1, s.y0, s.z0], [s.x1, s.y1, s.z0], [s.x0, s.y1, s.z0]];
      const front = [[s.x0, s.y1, s.z0], [s.x1, s.y1, s.z0], [s.x1, s.y1, s.z1], [s.x0, s.y1, s.z1]];
      markup += poly(bottom, 's-soffit');
      markup += poly(front, 's-soffit');
      if (s.face === 'left') markup += poly([[s.x1, s.y0, s.z0], [s.x1, s.y1, s.z0], [s.x1, s.y1, s.z1], [s.x1, s.y0, s.z1]], 's-soffit');
      if (s.face === 'right') markup += poly([[s.x0, s.y0, s.z0], [s.x0, s.y1, s.z0], [s.x0, s.y1, s.z1], [s.x0, s.y0, s.z1]], 's-soffit');
    }
    const [lx, ly] = project(s.cx, s.cy, s.face === 'floor' ? s.z1 : s.z0);
    markup += `<text class="s-soffitnum" x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" font-size="${Math.max(11, (maxX - minX) / 34)}">${index + 1}</text>`;
  });
  plan.lights.forEach((light, index) => {
    const y0 = light.y - 1.5;
    const y1 = light.y + 1.5;
    const proud = 2.6;
    markup += poly([[proud, y0, 0], [proud, y1, 0], [proud, y1, H], [proud, y0, H]], 's-light');
    markup += poly([[0, y0, H - proud], [W, y0, H - proud], [W, y1, H - proud], [0, y1, H - proud]], 's-light');
    markup += poly([[W - proud, y0, 0], [W - proud, y1, 0], [W - proud, y1, H], [W - proud, y0, H]], 's-light');
    const [lx, ly] = project(W / 2, light.y, H - proud);
    markup += `<text class="s-lightnum" x="${lx}" y="${ly}" text-anchor="middle" font-size="${Math.max(11, (maxX - minX) / 36)}">${index + 1}</text>`;
  });
  const [ballX, ballY] = project(plan.ball.x, plan.ball.y, 1);
  markup += `<circle class="s-ball" cx="${ballX}" cy="${ballY}" r="${Math.max(2.6, Math.abs(project(plan.ball.x + 1.6, plan.ball.y, 1)[0] - ballX))}"/>`;
  const hitPoly = (points) => `<polygon class="s-hit" points="${points.map((point) => project(...point).map((value) => value.toFixed(1)).join(',')).join(' ')}"/>`;
  const openHit = (kind, label, extra = '') => `<g class="s-drag" data-drag="${kind}" ${extra} aria-label="${esc(label)}">`;
  plan.cups.forEach((cup, index) => {
    const [cx, cy] = project(cup.x, cup.y, 0.4);
    const edge = project(cup.x + 2.4, cup.y, 0.4)[0];
    const rx = Math.max(2.5, Math.abs(edge - cx));
    markup += `<ellipse class="s-cup" cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx * 0.4}" style="fill:var(--ink)"/>`;
    markup += `<text class="s-cupnum" x="${cx + rx * 1.8}" y="${cy}" dominant-baseline="middle" font-size="${Math.max(11, rx * 1.6)}">${index + 1}</text>`;
    markup += openHit('cup', `Putting cup ${index + 1}. Drag it to the spot where the cup is cut into the turf.`, `data-i="${index}" data-plane="floor"`);
    markup += `<circle class="s-hit" cx="${cx}" cy="${cy}" r="${Math.max(16, rx * 3.5)}"/>`;
    markup += '</g>';
  });
  markup += openHit('ball', 'Hitting mat. Drag to place the ball. Ball-to-screen and the center offset update.', 'data-plane="floor"');
  markup += hitPoly([[mat.x, mat.y, 0.5], [mat.x + mat.w, mat.y, 0.5], [mat.x + mat.w, mat.y + mat.d, 0.5], [mat.x, mat.y + mat.d, 0.5]]);
  markup += '</g>';
  markup += openHit('ball', 'Ball. Drag to place it. Ball-to-screen and the center offset update.', 'data-plane="floor"');
  markup += `<circle class="s-hit" cx="${ballX}" cy="${ballY}" r="22"/>`;
  markup += '</g>';
  if (launch.mount === 'ceiling') {
    markup += openHit('lm', 'Launch monitor. Drag toward or away from the screen. It stays on the target line.', `data-plane="level" data-zval="${launch.z}"`);
    markup += hitPoly([[launch.x - 7, launch.y - 5, launch.z], [launch.x + 7, launch.y - 5, launch.z], [launch.x + 7, launch.y + 5, launch.z], [launch.x - 7, launch.y + 5, launch.z]]);
    markup += '</g>';
  }
  if (projector.y < camY - 20) {
    markup += openHit('proj', 'Projector. Drag toward or away from the screen to set the throw. It stays centered on the screen.', `data-plane="level" data-zval="${projector.z - 7}"`);
    markup += hitPoly([[projector.x - 10, projector.y - 8, projector.z - 7], [projector.x + 10, projector.y - 8, projector.z - 7], [projector.x + 10, projector.y + 8, projector.z - 7], [projector.x - 10, projector.y + 8, projector.z - 7]]);
    markup += '</g>';
  }
  if (cabinet.wall === 'left' || cabinet.wall === 'right') {
    const face = cabinet.wall === 'left' ? cabinet.d : W - cabinet.d;
    const y0 = cabinet.a - cabinet.w / 2;
    const y1 = cabinet.a + cabinet.w / 2;
    markup += openHit('cab', 'Computer cabinet. Drag along the wall. The wall offset updates.', `data-plane="x" data-xval="${face}"`);
    markup += hitPoly([[face, y0, 0], [face, y1, 0], [face, y1, cabinet.h], [face, y0, cabinet.h]]);
    markup += '</g>';
  }
  plan.tvs.forEach((tv, index) => {
    if (tv.wall !== 'left' && tv.wall !== 'right') return;
    const x = tv.wall === 'left' ? 1 : W - 1;
    markup += openHit('tv', `TV ${index + 1}. Drag along the wall or up and down. Position and height update.`, `data-i="${index}" data-plane="x" data-xval="${tv.wall === 'left' ? 0 : W}"`);
    markup += hitPoly([[x, tv.a - tv.w / 2, tv.z - tv.h / 2], [x, tv.a + tv.w / 2, tv.z - tv.h / 2], [x, tv.a + tv.w / 2, tv.z + tv.h / 2], [x, tv.a - tv.w / 2, tv.z + tv.h / 2]]);
    markup += '</g>';
  });
  if (plan.mon && !plan.mon.onCab && (plan.mon.wall === 'left' || plan.mon.wall === 'right')) {
    const x = plan.mon.wall === 'left' ? 1 : W - 1;
    markup += openHit('mon', 'Monitor. Drag along the wall or up and down. Position and height update.', `data-plane="x" data-xval="${plan.mon.wall === 'left' ? 0 : W}"`);
    markup += hitPoly([[x, plan.mon.a - plan.mon.w / 2, plan.mon.z - plan.mon.h / 2], [x, plan.mon.a + plan.mon.w / 2, plan.mon.z - plan.mon.h / 2], [x, plan.mon.a + plan.mon.w / 2, plan.mon.z + plan.mon.h / 2], [x, plan.mon.a - plan.mon.w / 2, plan.mon.z + plan.mon.h / 2]]);
    markup += '</g>';
  }
  plan.soffits.forEach((s, index) => {
    const where = soffitWhere(s.face).toLowerCase();
    let extra = `data-i="${index}"`;
    const faces = [];
    if (s.face === 'ceiling') {
      extra += ` data-plane="level" data-zval="${s.z0}"`;
      faces.push([[s.x0, s.y0, s.z0], [s.x1, s.y0, s.z0], [s.x1, s.y1, s.z0], [s.x0, s.y1, s.z0]]);
      faces.push([[s.x0, s.y1, s.z0], [s.x1, s.y1, s.z0], [s.x1, s.y1, s.z1], [s.x0, s.y1, s.z1]]);
    } else if (s.face === 'floor') {
      extra += ' data-plane="floor"';
      faces.push([[s.x0, s.y0, s.z1], [s.x1, s.y0, s.z1], [s.x1, s.y1, s.z1], [s.x0, s.y1, s.z1]]);
      faces.push([[s.x0, s.y1, 0], [s.x1, s.y1, 0], [s.x1, s.y1, s.z1], [s.x0, s.y1, s.z1]]);
    } else if (s.face === 'left') {
      extra += ` data-plane="x" data-xval="${s.x1}"`;
      faces.push([[s.x1, s.y0, s.z0], [s.x1, s.y1, s.z0], [s.x1, s.y1, s.z1], [s.x1, s.y0, s.z1]]);
    } else if (s.face === 'right') {
      extra += ` data-plane="x" data-xval="${s.x0}"`;
      faces.push([[s.x0, s.y0, s.z0], [s.x0, s.y1, s.z0], [s.x0, s.y1, s.z1], [s.x0, s.y0, s.z1]]);
    } else {
      extra += ` data-plane="y" data-yval="${s.y1}"`;
      faces.push([[s.x0, s.y1, s.z0], [s.x1, s.y1, s.z0], [s.x1, s.y1, s.z1], [s.x0, s.y1, s.z1]]);
    }
    markup += openHit('soffit', `Soffit ${index + 1}. Drag it along the ${where}. The size stays as entered.`, extra);
    faces.forEach((points) => { markup += hitPoly(points); });
    markup += '</g>';
  });
  const viewW = Math.max(40, maxX - minX);
  const draggedPersp = guidePlace(plan, 'persp');
  if (draggedPersp) markup += perspDragGuides(plan, draggedPersp, project, viewW / 28);
  return markup + '</svg>';
}

function placements(plan) {
  const spec = S.job.spec;
  const rows = [];
  const add = (item, x, y, z, mount, notes, px, py) => rows.push({ item, x, y, z, mount, notes, px: px ?? x, py: py ?? y });
  add('Impact screen (face)', null, plan.scr.y, `${ftin(plan.scr.z0)}–${ftin(plan.scr.z1)}`, 'Frame to blocking', `Screen ${ftin(plan.scr.w)} × ${ftin(plan.scr.h)}. ${ftin(spec.sideTrim)} trim each side. Face is ${ftin(plan.scr.y)} off the back wall.`, plan.W / 2, plan.scr.y);
  add('Ball position', plan.ball.x, plan.ball.y, 0, 'Floor', `Snap the target line from screen center to the ball. ${spec.handed === 'Both' ? 'Dual-handed' : spec.handed} setup.`);
  add('Hitting mat' + (spec.matCutout ? ' (flush inset)' : ''), plan.mat.x, plan.mat.y, 0, 'Floor', `${plan.mat.name}. Corner dims are the mat's left-front corner${spec.matCutout ? '. Cut turf and subfloor to mat size plus 1/8 in.' : ''}.`, plan.mat.x, plan.mat.y);
  add('Launch monitor — ' + plan.lm.name, r1(plan.lm.x), r1(plan.lm.y), plan.lm.mount === 'ceiling' ? ftin(plan.lm.z) + ' (to unit)' : 'Floor', plan.lm.mount === 'ceiling' ? 'Ceiling' : 'Floor', plan.lm.note + ' Positions are planning values. Final aim follows the manufacturer.');
  add('Projector (lens)', r1(plan.pj.x), r1(plan.pj.y), ftin(plan.pj.z), 'Ceiling', `Throw ${ftin(plan.pj.throwD)} at TR ${plan.pj.tr}. Image ${ftin(plan.img.w)} wide. Verify lens offset with the manufacturer calculator.`);
  plan.cups.forEach((cup, index) => add(`Putting cup ${index + 1}`, r1(cup.x), r1(cup.y), 0, 'Cut into the turf', '4¼ in hole. Set the cup ½ in below the turf at the placed mark.'));
  plan.lights.forEach((light, index) => add(`Light bar ${index + 1}`, 0, r1(light.y), `0–${ftin(plan.H)}`, 'Left wall, ceiling, right wall', `${light.label}. Continuous bar in the panel gap. No run on the floor.`, plan.W / 2, light.y));
  plan.soffits.forEach((s, index) => add(`Existing soffit ${index + 1}`, r1(s.x0), r1(s.y0), `${ftin(s.z0)}–${ftin(s.z1)}`, soffitWhere(s.face), `Fixed bulkhead, ${ftin(s.x1 - s.x0)} × ${ftin(s.y1 - s.y0)}, ${soffitHeightPhrase(s)}. Work around it.`, s.cx, s.cy));
  const cabinetPoint = wallXY(plan.cab.wall, plan.cab.a, plan.W, plan.D);
  add('Computer cabinet', r1(cabinetPoint.x), r1(cabinetPoint.y), ftin(plan.cab.h) + ' top', cap(plan.cab.wall) + ' wall', `Center on the wall point. ${ftin(plan.cab.w)} wide × ${ftin(plan.cab.d)} deep.`);
  if (plan.mon) {
    const point = plan.mon.onCab ? cabinetPoint : wallXY(plan.mon.wall, plan.mon.a, plan.W, plan.D);
    add('Computer monitor', r1(point.x), r1(point.y), ftin(plan.mon.z) + ' ctr', plan.mon.onCab ? 'On cabinet' : cap(plan.mon.wall) + ' wall', plan.mon.onCab ? 'Desk stand on the cabinet' : 'Arm on backing B9, outside the swing radius');
  }
  plan.tvs.forEach((tv, index) => {
    const point = wallXY(tv.wall, tv.a, plan.W, plan.D);
    add(`TV ${index + 1} (${tv.size}")`, r1(point.x), r1(point.y), ftin(tv.z) + ' ctr', cap(tv.wall) + ' wall', 'Mount to backing. Hide the cable in the tube.');
  });
  (spec.panelWalls || []).forEach((wall) => {
    const wallPanels = plan.panels.filter((panel) => panel.wall === wall);
    if (!wallPanels.length) return;
    if (wall === 'ceiling') {
      add(`HUSH ceiling panels (${wallPanels.length})`, plan.W / 2, plan.scr.y, 'Ceiling', 'Ceiling grid', `Nominal 2 ft × 2 ft tiles, full width, from the screen line back ${ftin(plan.run)}.`, plan.W / 2, plan.scr.y + plan.run / 2);
      return;
    }
    const start = Math.min(...wallPanels.map((panel) => panel.a0));
    const end = Math.max(...wallPanels.map((panel) => panel.a1));
    const point = wallXY(wall, start, plan.W, plan.D);
    add(`HUSH wall panels — ${wall} (${wallPanels.length})`, r1(point.x), r1(point.y), `0–${ftin(Math.max(...wallPanels.map((panel) => panel.z1)))}`, cap(wall) + ' wall', `2 ft × 2 ft tiles. Start at the ${wall === 'rear' ? 'left corner' : 'screen line'} and run ${ftin(end - start)}.`);
  });
  add('Turf', 0, plan.scr.y, 0, 'Floor', `${spec.turf === 'full' ? 'Wall to wall' : 'Screen width'} from the screen line to the rear wall. About ${Math.round((plan.turfArea - plan.cutArea) / 144)} sq ft net.`, null, null);
  rows.forEach((row) => { if (row.item === 'Turf') row.px = null; });
  return rows;
}

function steps(plan) {
  const spec = S.job.spec;
  const list = [
    ['verify', 'Verify rough-in against the builder sheet', 'Backing, receptacles, Cat6, and tech tubes are in place. Photograph each before panels go up.'],
    ['layout', 'Snap layout lines', 'Screen line, target line, ball center, mat outline, projector, and launch-monitor points from the schedule.'],
  ];
  if (plan.soffits.length) list.splice(2, 0, ['soffit', 'Confirm the existing soffits', `${plan.soffits.length} soffit${plan.soffits.length === 1 ? '' : 's'} are drawn on the plan. Measure each one before panels and the screen go up.`]);
  if (plan.panels.length) list.push(['panels', 'Install HUSH panels', `${plan.panels.length} nominal 2×2 ft panels. Side and rear walls run from the floor to the ceiling. Ceiling tiles start at the screen line and run back ${ftin(plan.run)}, with a gap so each panel stays separate.`]);
  if (plan.lights.length) list.push(['lights', 'Set the light bars', `${plan.lights.length} continuous bar${plan.lights.length === 1 ? '' : 's'} in the panel gaps. Each bar runs up the left wall, across the ceiling, and down the right wall. No floor run.`]);
  list.push(['screen', 'Hang the screen frame and impact screen', 'Fasten to B1–B3 backing. Tension evenly. Check the projected area for wrinkles.']);
  list.push(['turf', 'Lay turf' + (spec.matCutout ? ' and cut the mat inset' : ''), spec.matCutout ? 'Cut the inset to mat size plus 1/8 in. Mat surface sits flush with the turf.' : 'Keep seams away from the hitting area.']);
  if (plan.cups.length) list.push(['cups', 'Cut and set putting cups', `${plan.cups.length} cup${plan.cups.length === 1 ? '' : 's'} cut into the turf at the placed marks.`]);
  list.push(['lm', 'Mount the launch monitor', plan.lm.mount === 'ceiling' ? 'Bolt to B5. Level it and aim at the hitting area per the manufacturer.' : 'Set the unit on the marked spot. Route power and data from the floor box.']);
  list.push(['proj', 'Mount the projector', `Lens at ${ftin(plan.pj.y)} from the back wall. Square to the screen, keystone off, filling an image ${ftin(plan.img.w)} wide.`]);
  list.push(['pc', 'Set the computer and pull cables', 'Run HDMI, USB, and Cat6 through the tubes. Label both ends.']);
  if (plan.tvs.length || plan.mon) list.push(['tv', 'Mount TVs and the monitor', 'On the marked backing. Hide cables in the tubes.']);
  list.push(['cal', 'Install software and calibrate', 'Align the launch monitor and the screen. Test shots from both sides if the bay is dual-handed.']);
  list.push(['walk', 'Client walkthrough and photos', 'Run a session with the client. Add photos to the job notes.']);
  return list;
}

const FORM = [
  ['Job', [
    ['name', 'Job name', 'text', { full: 1 }],
    ['client', 'Client', 'text'],
    ['clientType', 'Client type', 'select', { opts: CLIENT_TYPES }],
    ['location', 'Location', 'text'],
    ['rep', 'Sales rep', 'text'],
    ['status', 'Status', 'select', { opts: STATUSES }],
    ['discount', 'Discount ($)', 'number'],
  ], true],
  ['Your space', [
    ['s.W', 'Room width (in)', 'number', { hint: 1 }],
    ['s.D', 'Room depth (in)', 'number', { hint: 1 }],
    ['s.H', 'Ceiling height (in)', 'number', { hint: 1 }],
    ['s.handed', 'Golfer', 'select', { opts: [['RH', 'Right-handed'], ['LH', 'Left-handed'], ['Both', 'Both / dual']] }],
    ['s.golferH', 'Tallest golfer (in)', 'number', { hint: 1 }],
    ['s.teeDist', 'Ball to screen (in)', 'number', { hint: 1 }],
    ['s.ballX', 'Ball offset from center (in, + = right)', 'number', { full: 1 }],
  ]],
  ['Soffits', [
    ['s.soffitCount', 'Soffits', 'select', { opts: [['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6']], full: 1, hint: 'Existing bulkheads stay on the surface you pick, including a raised section on the floor. Set the size, then drag each one on the drawing.' }],
  ], true],
  ['Screen & HUSH panels', [
    ['s.screenOffset', 'Screen off back wall (in)', 'number'],
    ['s.sideTrim', 'Side trim each side (in)', 'number'],
    ['s.topGap', 'Gap at ceiling (in)', 'number'],
    ['s.floorGap', 'Screen bottom above floor (in)', 'number'],
    ['s.aspect', 'Image aspect', 'select', { opts: ['16:9', '16:10', '4:3'] }],
    ['s.panelWalls', 'HUSH surfaces', 'checks', { opts: ['left', 'right', 'rear', 'ceiling'], full: 1 }],
    ['s.panelRun', 'Coverage from screen (in)', 'number', { full: 1, hint: 1 }],
  ]],
  ['Light bars', [
    ['s.lightCount', 'Light bars', 'select', { opts: [['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8']], full: 1, hint: 'One continuous bar up the left wall, across the ceiling, and down the right wall. Pick the gap between panels.' }],
  ]],
  ['Launch monitor', [
    ['s.lm', 'Launch monitor', 'select', { opts: LMS.map((item) => [item.id, item.name]), full: 1 }],
    ['s.lmAdj', 'Mount offset adjust (in)', 'number'],
    ['s.software', 'Software', 'select', { opts: SOFT.map((item) => [item.id, item.name]) }],
  ]],
  ['Projector', [
    ['s.proj', 'Projector', 'select', { opts: PROJS.map((item) => [item.id, item.name]), full: 1 }],
    ['s.tr', 'Throw ratio', 'number', { step: 0.01 }],
    ['s.projDrop', 'Mount drop (in)', 'number'],
  ]],
  ['Computer, monitor, TVs', [
    ['s.compWall', 'Computer wall', 'select', { opts: [['rear', 'Rear'], ['left', 'Left'], ['right', 'Right']] }],
    ['s.compPos', 'Offset on wall (in)', 'number'],
    ['s.monitor', 'Monitor', 'select', { opts: [['wall', 'Wall arm at hitting area'], ['cabinet', 'On computer cabinet'], ['none', 'None']], full: 1 }],
    ['s.monZ', 'Monitor center above floor (in)', 'number'],
    ['s.tvCount', 'TVs', 'select', { opts: [['0', '0'], ['1', '1'], ['2', '2'], ['3', '3']] }],
  ]],
  ['Turf, mat & putting', [
    ['s.turf', 'Turf', 'select', { opts: [['full', 'Full room'], ['bay', 'Hitting bay only']] }],
    ['s.cups', 'Putting cups', 'select', { opts: [['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4']], hint: 'Drag each cup on the drawing' }],
    ['s.mat', 'Hitting mat', 'select', { opts: MATS.map((item) => [item.id, item.name]).concat([['custom', 'Custom size']]), full: 1 }],
    ['s.matCutout', 'Flush mat cutout', 'checks', { opts: ['yes'], full: 1 }],
  ]],
];

function getVal(path) {
  if (path.startsWith('s.')) return S.job.spec[path.slice(2)];
  return S.job[path];
}

function setVal(path, value) {
  if (path.startsWith('s.')) S.job.spec[path.slice(2)] = value;
  else S.job[path] = value;
}

function buildForm() {
  let html = '';
  FORM.forEach(([title, fields, open], index) => {
    html += `<details ${open || index === 1 ? 'open' : ''}><summary><h3>${title}</h3></summary><div class="fields">`;
    fields.forEach(([path, label, type, options = {}]) => {
      const id = 'f_' + path.replace('.', '_');
      html += `<div class="f ${options.full ? 'full' : ''}"><label for="${id}">${label}</label>`;
      if (type === 'select') {
        html += `<select id="${id}" data-p="${path}">${options.opts.map((option) => {
          const [value, text] = Array.isArray(option) ? option : [option, option];
          return `<option value="${esc(value)}">${esc(text)}</option>`;
        }).join('')}</select>`;
      } else if (type === 'checks') {
        html += `<div class="checks">${options.opts.map((option) => `<label><input type="checkbox" id="${id}_${option}" data-p="${path}" data-v="${option}"> ${option === 'yes' ? 'Inset mat flush with turf' : cap(option)}</label>`).join('')}</div>`;
      } else {
        html += `<input id="${id}" data-p="${path}" type="${type}" autocomplete="off" ${type === 'number' ? `step="${options.step || 'any'}"` : ''}>`;
      }
      if (options.hint) html += `<span class="hint" id="${id}_h">${typeof options.hint === 'string' ? esc(options.hint) : ''}</span>`;
      html += '</div>';
    });
    html += '</div></details>';
    if (title.startsWith('Computer')) html = html.replace(/<\/div><\/details>$/, '<div class="tvrows" id="tvRows"></div></div></details>');
    if (title === 'Soffits') html = html.replace(/<\/div><\/details>$/, '<div class="soffitrows" id="soffitRows"></div></div></details>');
    if (title === 'Light bars') html = html.replace(/<\/div><\/details>$/, '<div class="soffitrows" id="lightRows"></div></div></details>');
    if (title.startsWith('Turf')) html = html.replace(/<\/div><\/details>$/, `<div class="matsize" id="matSize"><div class="f"><label for="mat_w_ft">Width</label><div class="ftin"><input id="mat_w_ft" data-mat="w" data-part="ft" type="number" min="1" max="40" step="1" inputmode="numeric"><span>ft</span><input id="mat_w_in" data-mat="w" data-part="in" type="number" min="0" max="11.5" step="0.5" inputmode="decimal"><span>in</span></div></div><div class="f"><label for="mat_d_ft">Length</label><div class="ftin"><input id="mat_d_ft" data-mat="d" data-part="ft" type="number" min="1" max="40" step="1" inputmode="numeric"><span>ft</span><input id="mat_d_in" data-mat="d" data-part="in" type="number" min="0" max="11.5" step="0.5" inputmode="decimal"><span>in</span></div></div><p class="hint">Width runs across the room. Length runs toward the screen.</p></div></div></details>`);
  });
  html += '<details><summary><h3>Notes</h3></summary><div class="fields"><div class="f full"><label for="f_notes">Job notes</label><textarea id="f_notes" data-p="notes" rows="4"></textarea></div></div></details>';
  $('#spec').innerHTML = html;
  $('#spec').addEventListener('input', onField);
  $('#spec').addEventListener('change', onField);
}

function fillForm() {
  document.querySelectorAll('#spec [data-p]').forEach((el) => {
    const path = el.dataset.p;
    const value = getVal(path);
    if (el.type === 'checkbox') {
      el.checked = path === 's.matCutout' ? !!value : (value || []).includes(el.dataset.v);
    } else el.value = value ?? '';
  });
  updateHints();
  syncTvRows();
  syncSoffitRows();
  syncLightRows();
  syncMatSize();
}

function updateHints() {
  ['W', 'D', 'H', 'golferH', 'teeDist', 'panelRun'].forEach((key) => {
    const node = document.getElementById('f_s_' + key + '_h');
    if (node) node.textContent = ftin(+S.job.spec[key]);
  });
}

function syncTvRows() {
  const host = document.getElementById('tvRows');
  if (!host || !S.job) return;
  ensureTvs(S.job.spec);
  const tvs = S.job.spec.tvs;
  if (host.childElementCount !== tvs.length) {
    host.innerHTML = tvs.map((tv, index) => `<div class="tv-card"><b>TV ${index + 1}</b><div class="fields tv-fields">
      <div class="f"><label for="tv_${index}_wall">Wall</label><select id="tv_${index}_wall" data-tv="${index}" data-k="wall"><option value="left">Left</option><option value="right">Right</option></select></div>
      <div class="f"><label for="tv_${index}_size">Size (in)</label><input id="tv_${index}_size" data-tv="${index}" data-k="size" type="number" min="32" max="98" step="1"></div>
      <div class="f"><label for="tv_${index}_z">Center above floor (in)</label><input id="tv_${index}_z" data-tv="${index}" data-k="z" type="number" step="any"><span class="hint" id="tv_${index}_zh"></span></div>
    </div></div>`).join('');
  }
  host.querySelectorAll('[data-tv]').forEach((el) => {
    if (document.activeElement === el) return;
    const tv = tvs[+el.dataset.tv];
    if (!tv) return;
    el.value = tv[el.dataset.k] ?? '';
  });
  tvs.forEach((tv, index) => {
    const hint = document.getElementById(`tv_${index}_zh`);
    if (hint) hint.textContent = ftin(+tv.z || 0);
  });
}

function syncSoffitRows() {
  const host = document.getElementById('soffitRows');
  if (!host || !S.job) return;
  ensureSoffits(S.job.spec);
  const items = S.job.spec.soffits.slice(0, S.job.spec.soffitCount);
  const sig = items.map((item) => item.face || 'ceiling').join(',');
  if (host.dataset.sig !== sig) {
    host.dataset.sig = sig;
    host.innerHTML = items.map((item, index) => {
      const free = item.face === 'ceiling' || item.face === 'floor';
      const heightLabel = item.face === 'floor' ? 'Height above floor (in)' : 'Drop from ceiling (in)';
      return `<div class="tv-card"><b>Soffit ${index + 1}</b><div class="fields tv-fields">
        <div class="f full"><label for="soffit_${index}_face">Surface</label><select id="soffit_${index}_face" data-soffit="${index}" data-k="face"><option value="left">Left wall</option><option value="right">Right wall</option><option value="ceiling">Ceiling</option><option value="screen">Screen wall</option><option value="floor">Floor</option></select></div>
        <div class="f"><label for="soffit_${index}_span">${free ? 'Width across room (in)' : 'Length along wall (in)'}</label><input id="soffit_${index}_span" data-soffit="${index}" data-k="span" type="number" min="6" step="1"><span class="hint" id="soffit_${index}_spanh"></span></div>
        <div class="f"><label for="soffit_${index}_proj">${free ? 'Depth along room (in)' : 'Projection into room (in)'}</label><input id="soffit_${index}_proj" data-soffit="${index}" data-k="proj" type="number" min="2" step="1"><span class="hint" id="soffit_${index}_projh"></span></div>
        <div class="f"><label for="soffit_${index}_drop">${heightLabel}</label><input id="soffit_${index}_drop" data-soffit="${index}" data-k="drop" type="number" min="2" step="1"><span class="hint" id="soffit_${index}_droph"></span></div>
      </div></div>`;
    }).join('');
  }
  host.querySelectorAll('[data-soffit]').forEach((el) => {
    if (document.activeElement === el) return;
    const item = items[+el.dataset.soffit];
    if (!item) return;
    el.value = item[el.dataset.k] ?? '';
  });
  items.forEach((item, index) => {
    const span = document.getElementById(`soffit_${index}_spanh`);
    const proj = document.getElementById(`soffit_${index}_projh`);
    const drop = document.getElementById(`soffit_${index}_droph`);
    if (span) span.textContent = ftin(+item.span || 0);
    if (proj) proj.textContent = ftin(+item.proj || 0);
    if (drop) drop.textContent = ftin(+item.drop || 0);
  });
}

function syncMatSize() {
  if (!S.job) return;
  ['w', 'd'].forEach((axis) => {
    const parts = splitFtIn(matInches(S.job.spec, axis));
    const feet = document.getElementById(`mat_${axis}_ft`);
    const inch = document.getElementById(`mat_${axis}_in`);
    if (feet && document.activeElement !== feet) feet.value = parts.feet;
    if (inch && document.activeElement !== inch) inch.value = parts.inch;
  });
}

function syncLightRows() {
  const host = document.getElementById('lightRows');
  if (!host || !S.job) return;
  ensureLights(S.job.spec);
  const seams = seamsForSpec(S.job.spec);
  const items = S.job.spec.lights.slice(0, S.job.spec.lightCount);
  const sig = items.length + '|' + seams.map((seam) => seam.label).join(',');
  if (host.dataset.sig !== sig) {
    host.dataset.sig = sig;
    host.innerHTML = items.map((item, index) => {
      const options = seams.length
        ? seams.map((seam) => `<option value="${seam.index}">${esc(seam.label)}</option>`).join('')
        : '<option value="0">Need at least two panels</option>';
      return `<div class="tv-card"><b>Light bar ${index + 1}</b><div class="f full"><label for="light_${index}">Between panels</label><select id="light_${index}" data-light="${index}" ${seams.length ? '' : 'disabled'}>${options}</select></div></div>`;
    }).join('');
  }
  host.querySelectorAll('[data-light]').forEach((el) => {
    if (document.activeElement === el) return;
    const item = items[+el.dataset.light];
    if (!item || !seams.length) return;
    const seam = Math.max(0, Math.min(seams.length - 1, Math.round(+item.seam || 0)));
    el.value = String(seams[seam].index);
  });
}

function onField(event) {
  const el = event.target;
  if (el.dataset.tv != null) {
    ensureTvs(S.job.spec);
    const tv = S.job.spec.tvs[+el.dataset.tv];
    if (!tv) return;
    if (el.dataset.k === 'wall') {
      tv.wall = el.value === 'right' ? 'right' : 'left';
      tv.pos = '';
    } else tv[el.dataset.k] = el.value === '' ? '' : +el.value;
    updateHints();
    markDirty();
    scheduleRender();
    return;
  }
  if (el.dataset.soffit != null) {
    ensureSoffits(S.job.spec);
    const item = S.job.spec.soffits[+el.dataset.soffit];
    if (!item) return;
    if (el.dataset.k === 'face') {
      item.face = ['left', 'right', 'ceiling', 'screen', 'floor'].includes(el.value) ? el.value : 'ceiling';
      item.pos = '';
      item.posY = '';
    } else item[el.dataset.k] = el.value === '' ? '' : +el.value;
    markDirty();
    scheduleRender();
    return;
  }
  if (el.dataset.mat) {
    const spec = S.job.spec;
    const axis = el.dataset.mat === 'd' ? 'd' : 'w';
    const current = { w: matInches(spec, 'w'), d: matInches(spec, 'd') };
    const parts = splitFtIn(current[axis]);
    const feet = el.dataset.part === 'ft' ? Math.max(0, +el.value || 0) : parts.feet;
    const inch = el.dataset.part === 'in' ? Math.max(0, +el.value || 0) : parts.inch;
    current[axis] = clampNum(Math.round((feet * 12 + inch) * 2) / 2, 12, 480);
    spec.matW = current.w;
    spec.matD = current.d;
    const match = MATS.find((item) => item.w === Math.round(current.w) && item.d === Math.round(current.d));
    spec.mat = match ? match.id : 'custom';
    markDirty();
    scheduleRender();
    return;
  }
  if (el.dataset.light != null) {
    ensureLights(S.job.spec);
    const item = S.job.spec.lights[+el.dataset.light];
    if (!item) return;
    item.seam = Math.max(0, Math.round(+el.value || 0));
    markDirty();
    scheduleRender();
    return;
  }
  const path = el.dataset.p;
  if (!path) return;
  let value;
  if (el.type === 'checkbox') {
    if (path === 's.matCutout') value = el.checked;
    else {
      const current = new Set(getVal(path) || []);
      if (el.checked) current.add(el.dataset.v);
      else current.delete(el.dataset.v);
      value = [...current];
    }
  } else if (el.type === 'number') value = el.value === '' ? '' : +el.value;
  else value = el.value;
  setVal(path, value);
  if (path === 's.proj') {
    S.job.spec.tr = projOf(value).tr;
    const ratio = $('#f_s_tr');
    if (ratio) ratio.value = S.job.spec.tr;
  }
  if (path === 's.tvCount' || path === 's.cups' || path === 's.soffitCount' || path === 's.lightCount') S.job.spec[path.slice(2)] = +value;
  if (path === 's.tvCount') ensureTvs(S.job.spec);
  if (path === 's.soffitCount') ensureSoffits(S.job.spec);
  if (path === 's.lightCount') ensureLights(S.job.spec);
  if (path === 's.mat') {
    const preset = MATS.find((item) => item.id === value);
    if (preset) {
      S.job.spec.matW = preset.w;
      S.job.spec.matD = preset.d;
    }
  }
  if (path === 's.monitor' || path === 's.handed') delete S.job.spec.monAlong;
  if (path === 's.compWall') S.job.spec.compPos = 24;
  updateHints();
  markDirty();
  scheduleRender();
}

let frame = 0;
function scheduleRender() {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(render);
}

function validSpec(spec) {
  return ['W', 'D', 'H', 'golferH', 'teeDist'].every((key) => +spec[key] > 0) && +spec.W >= 96 && +spec.D >= 120 && +spec.H >= 84;
}

function titleBlock() {
  const job = S.job;
  return `<div class="tb"><span>Job</span><b>${esc(job.name)}</b><span>Client</span><b>${esc(job.client || '—')} · ${esc(job.clientType)}</b><span>Location</span><b>${esc(job.location || '—')}</b><span>Status</span><b>${esc(job.status)}${job.example ? ' <span class="example">example</span>' : ''}</b></div>`;
}

function fitPill(fit) {
  return {
    good: '<span class="fit good">Good fit</span>',
    warn: '<span class="fit warn">Fits with caveats</span>',
    bad: '<span class="fit bad">Needs changes</span>',
  }[fit];
}

function checksHTML(plan) {
  return `<ul class="checklist">${plan.chk.map(([level, message]) => `<li><span class="dot ${level}"></span><span>${esc(message)}</span></li>`).join('')}</ul>`;
}

function wallSeg() {
  return `<div class="seg" role="group" aria-label="Choose wall">${['screen', 'left', 'right', 'rear'].map((wall) => `<button type="button" data-act="wall" data-v="${wall}" aria-pressed="${S.elevWall === wall}">${cap(wall)}</button>`).join('')}</div>`;
}

function salesHTML(plan) {
  const priced = quote(S.job.spec, plan, S.pb);
  const client = S.clientView;
  let rows = '';
  let group = '';
  priced.lines.forEach((line) => {
    if (line.grp !== group) {
      group = line.grp;
      rows += `<tr class="grp"><td colspan="${client ? 3 : 5}">${esc(group)}</td></tr>`;
    }
    rows += client
      ? `<tr><td>${esc(line.item)}</td><td class="n">${line.qty} ${line.unit}</td><td class="n">${money(line.ext)}</td></tr>`
      : `<tr><td>${esc(line.item)}</td><td class="n">${line.qty} ${line.unit}</td><td class="n">${money(line.price)}</td><td class="n">${r1(line.hrs) || ''}</td><td class="n">${money(line.ext)}</td></tr>`;
  });
  const span = client ? 2 : 4;
  rows += `<tr class="total"><td colspan="${span}">Equipment &amp; materials</td><td class="n">${money(priced.equip)}</td></tr>`;
  rows += `<tr><td colspan="${span}">Installation labor${client ? '' : ` (${r1(priced.hours)} hr × ${money(S.pb.laborRate)})`}</td><td class="n">${money(priced.labor)}</td></tr>`;
  rows += `<tr><td colspan="${span}">Design + builder CAD package</td><td class="n">${money(priced.design)}</td></tr>`;
  rows += `<tr><td colspan="${span}">Sales tax on equipment (${S.pb.taxRate}%)</td><td class="n">${money(priced.tax)}</td></tr>`;
  if (priced.disc) rows += `<tr><td colspan="${span}">Discount</td><td class="n">−${money(priced.disc)}</td></tr>`;
  rows += `<tr class="grand"><td colspan="${span}">Estimated total</td><td class="n">${money(priced.total)}</td></tr>`;
  return `<div class="sheet-head"><div><h1>Sales Quote &amp; Visual</h1><p>Size the bay to the client's room, show the render, and price it live. Edits here flow into the builder and installer sheets.</p></div>${titleBlock()}</div>
  <div class="stats">
    <div class="stat"><div class="k">Space fit</div><div class="v" style="font-size:16px;padding-top:4px">${fitPill(plan.fit)}</div></div>
    <div class="stat"><div class="k">Room</div><div class="v">${ftin(plan.W)} × ${ftin(plan.D)}</div></div>
    <div class="stat"><div class="k">Image</div><div class="v">${ftin(plan.img.w)} × ${ftin(plan.img.h)}</div></div>
    <div class="stat"><div class="k">Estimate</div><div class="v">${money(priced.total)}</div></div>
  </div>
  <div class="panel"><div class="panel-h"><h2>Client visual</h2><span class="savestate">View from behind the hitting area · ${esc(plan.lm.name)} · ${esc(plan.pj.name.split(' (')[0])} · ${plan.panels.length} HUSH 2×2 panels${plan.soffits.length ? ` · ${plan.soffits.length} soffit${plan.soffits.length === 1 ? '' : 's'}` : ''}</span></div><div class="panel-b"><div class="drawing">${perspectiveSVG(plan)}</div><p class="savestate" style="margin-top:8px">Click an item to show its distance from the impact screen, the walls, and the floor. The lines follow it while you drag, and they clear when you click the drawing background.</p></div></div>
  <div class="grid2">
    <div class="panel"><div class="panel-h"><h2>Floor plan</h2></div><div class="panel-b"><div class="drawing">${planSVG(plan, 'sales')}</div>
      <div class="legend" style="margin-top:8px"><span><i class="sw" style="background:#2c312f"></i>HUSH panel</span><span><i class="sw" style="background:#f7f3e6;border:1px solid #c9a227"></i>Light bar</span><span><i class="sw" style="background:var(--turf);opacity:.5"></i>Turf</span><span><i class="sw" style="background:var(--surface);border:1px solid var(--ink);border-radius:50%"></i>Putting cup</span><span><i class="sw" style="background:var(--warn-soft);border:1px dashed var(--warn)"></i>Soffit</span><span><i class="sw" style="border:1px dashed var(--warn)"></i>Swing radius</span><span><i class="sw" style="background:var(--cad);opacity:.25"></i>Projector throw</span></div>
      <p class="savestate" style="margin-top:8px">Click an item to show its distance from the impact screen, each side wall, and the floor. Drag it to update the layout. Click the drawing background to clear the lines.</p></div></div>
    <div class="panel"><div class="panel-h"><h2>Space check</h2>${fitPill(plan.fit)}</div><div class="panel-b">${checksHTML(plan)}<p class="savestate" style="margin-top:10px">Clearances are planning rules of thumb. Confirm with a swing test and the manufacturer's install specs before ordering.</p></div></div>
  </div>
  <div class="panel"><div class="panel-h"><h2>Quote</h2><div class="actions"><div class="seg" role="group" aria-label="Quote view"><button type="button" data-act="cv" data-v="0" aria-pressed="${!client}">Internal</button><button type="button" data-act="cv" data-v="1" aria-pressed="${client}">Client</button></div><button type="button" class="btn" data-act="copyquote">Copy quote</button><button type="button" class="btn" data-act="dl-sales">Download proposal</button></div></div>
    <div class="panel-b tablewrap"><table><thead><tr><th>Item</th><th class="n">Qty</th>${client ? '' : '<th class="n">Unit</th><th class="n">Hrs</th>'}<th class="n">Amount</th></tr></thead><tbody>${rows}</tbody></table>
    <p class="savestate" style="margin-top:8px">Prices come from this location's Price Book. Defaults are placeholders until the franchise replaces them.</p></div></div>`;
}

function builderHTML(plan) {
  const spec = S.job.spec;
  const backingRows = plan.backing.map((item) => `<tr><td class="m">${esc(item.id)}</td><td>${esc(item.label)}</td><td>${esc(item.where)}</td><td>${esc(item.spec)}</td><td class="m">${item.wall ? `${ftin(Math.min(item.a0, item.a1))}–${ftin(Math.max(item.a0, item.a1))} along wall` : `X ${ftin(item.x)} · Y ${ftin(item.y)}`}</td><td class="m">${esc(item.size)}</td></tr>`).join('');
  const powerRows = plan.elec.map((item) => `<tr><td class="m">${esc(item.id)}</td><td>${esc(item.label)}</td><td>${esc(item.spec)}</td><td class="m">X ${ftin(item.x)} · Y ${ftin(item.y)}</td><td class="m">${item.mount === 'ceiling' ? 'Ceiling' : item.mount === 'floor' ? 'Floor box' : ftin(item.z) + ' AFF'}</td></tr>`).join('')
    + plan.data.map((item) => `<tr><td class="m">${esc(item.id)}</td><td>${esc(item.label)}</td><td>${esc(item.spec)}</td><td class="m">X ${ftin(item.x)} · Y ${ftin(item.y)}</td><td class="m">${item.wall ? ftin(item.z) + ' AFF' : 'Ceiling'}</td></tr>`).join('');
  const tubeRows = plan.tubes.map((tube) => `<tr><td class="m">${esc(tube.id)}</td><td>${esc(tube.label)}</td><td class="n">${Math.round(tube.len)} ft</td><td>${tube.cable.len} ft ${tube.cable.aoc ? 'active optical HDMI' : 'HDMI'} + USB/Cat6 pull string</td></tr>`).join('');
  return `<div class="sheet-head"><div><h1>Builder Rough-In CAD</h1><p>For the home builder, remodeler, or the homeowner's trades: backing, receptacles, low-voltage, and 2 in tech tubes before drywall. X is from the left wall facing the screen. Y is from the screen wall.</p></div>${titleBlock()}</div>
  <div class="panel"><div class="panel-h"><h2>Reflected ceiling + floor plan</h2><div class="actions"><button type="button" class="btn" data-act="reset-tags">Reset tags</button><button type="button" class="btn" data-act="dl-builder">Download builder sheet</button></div></div><div class="panel-b"><div class="drawing">${planSVG(plan, 'builder')}</div>
    <div class="legend" style="margin-top:8px"><span><i class="sw" style="background:#2c312f"></i>HUSH 2×2</span><span><i class="sw" style="background:#f7f3e6;border:1px solid #c9a227"></i>Light bar</span><span><i class="sw" style="border-top:2px dashed var(--cad);height:0"></i>Screen centerline</span><span><i class="sw" style="background:var(--warn-soft);border:1px dashed var(--warn)"></i>Soffit</span><span><i class="sw" style="background:var(--backing);opacity:.5"></i>Backing / blocking</span><span><svg width="14" height="14" viewBox="-7 -7 14 14">${elecSym(0, 0, 5.5, 'ceiling')}</svg>Receptacle</span><span><svg width="14" height="14" viewBox="-7 -7 14 14">${elecSym(0, 0, 5.5, 'floor')}</svg>Floor box</span><span><svg width="14" height="14" viewBox="-7 -7 14 14"><polygon class="s-data" points="0,-5 5,4 -5,4"/></svg>Cat6</span><span><i class="sw" style="border-top:2px dashed var(--tube);height:0"></i>2 in tech tube</span><span><i class="sw" style="border:1px dashed var(--bad)"></i>No-fixture ring</span></div>
    <p class="savestate" style="margin-top:8px">Click an item to show its distance from the impact screen, each side wall, and the floor. Drag a TV onto the left or right wall; set each TV's size in the specification. The projector and overhead launch monitor stay on the target line.</p></div></div>
  <div class="panel"><div class="panel-h"><h2>Wall elevation</h2>${wallSeg()}</div><div class="panel-b"><div class="drawing">${elevSVG(plan, S.elevWall, 'builder')}</div><p class="savestate" style="margin-top:8px">Click an item to show its distance from the screen, the rear wall, and the floor. Drag it to update the position and height.</p></div></div>
  <div class="panel"><div class="panel-h"><h2>Backing schedule</h2></div><div class="panel-b tablewrap"><table><thead><tr><th>Tag</th><th>Item</th><th>Where</th><th>Spec</th><th>Location</th><th>Size</th></tr></thead><tbody>${backingRows}</tbody></table></div></div>
  <div class="grid2">
    <div class="panel"><div class="panel-h"><h2>Electrical + low voltage</h2></div><div class="panel-b tablewrap"><table><thead><tr><th>Tag</th><th>Item</th><th>Spec</th><th>Location</th><th>Height</th></tr></thead><tbody>${powerRows}</tbody></table></div></div>
    <div class="panel"><div class="panel-h"><h2>Tech tubes</h2></div><div class="panel-b tablewrap"><table><thead><tr><th>Tag</th><th>Run</th><th class="n">Est. length</th><th>Pull</th></tr></thead><tbody>${tubeRows}</tbody></table>
    <ul class="notes" style="margin-top:10px"><li>2 in ENT (smurf tube) with a pull string. Use sweeps, not 90° elbows. Terminate in a low-voltage ring at each end.</li><li>Runs over 25 ft need active optical HDMI and a powered USB or USB-over-Cat6 extender.</li></ul></div></div>
  </div>
  <div class="panel"><div class="panel-h"><h2>General notes for the trades</h2></div><div class="panel-b"><ul class="notes">
    <li>${plan.soffits.length ? `Existing soffits are drawn on every view. ${plan.soffits.map((s, index) => `Soffit ${index + 1} is on the ${soffitWhere(s.face).toLowerCase()}, with its ${soffitHeightPhrase(s)}.`).join(' ')} ` : ''}Finished ceiling must be at least ${ftin(plan.H)} as drawn. Any duct, beam, or soffit that is not drawn, and any soffit inside the swing ring, changes this plan. Send a photo to QuickLinks before framing.</li>
    <li>Solid blocking between joists at every ceiling pad, whatever the joist direction. No sprinkler heads, can lights, or HVAC registers inside the no-fixture ring or between the projector and the screen.</li>
    <li>Screen wall: flat, smooth finish. Paint the screen wall and the first 4 ft of ceiling flat black or dark grey to cut reflected light.</li>
    <li>${spec.matCutout ? `Flush mat inset ${ftin(plan.mat.w)} × ${ftin(plan.mat.d)} at the mat location. Slab or subfloor must be level within 1/8 in over 10 ft.` : 'Floor must be level within 1/8 in over 10 ft for the hitting mat.'}</li>
    <li>Dedicated 20A circuits for the projector and the computer. Light switches on a dimmer at the room entry.</li>
  </ul></div></div>`;
}

function installerHTML(plan) {
  const places = placements(plan);
  const sequence = steps(plan);
  const checks = S.job.checklist || {};
  const done = sequence.filter((step) => checks[step[0]]).length;
  const rows = places.map((place, index) => `<tr><td class="m">${index + 1}</td><td>${esc(place.item)}</td><td class="m">${place.x == null ? '—' : ftin(place.x)}</td><td class="m">${ftin(place.y)}</td><td class="m">${typeof place.z === 'number' ? ftin(place.z) : esc(place.z)}</td><td>${esc(place.mount)}</td><td>${esc(place.notes)}</td></tr>`).join('');
  return `<div class="sheet-head"><div><h1>Installer Build Plan</h1><p>Placement for the crew. X is measured from the left wall facing the screen. Y is from the screen wall. Numbers on the plan match the schedule.</p></div>${titleBlock()}</div>
  <div class="panel"><div class="panel-h"><h2>Placement plan</h2><button type="button" class="btn" data-act="dl-installer">Download installer sheet</button></div><div class="panel-b"><div class="drawing">${planSVG(plan, 'installer')}</div><p class="savestate" style="margin-top:8px">Click an item to show its distance from the impact screen, each side wall, and the floor. Drag it to update the schedule.</p></div></div>
  <div class="panel"><div class="panel-h"><h2>Placement schedule</h2></div><div class="panel-b tablewrap"><table><thead><tr><th>#</th><th>Item</th><th>X (left wall)</th><th>Y (back wall)</th><th>Height</th><th>Mount</th><th>Notes</th></tr></thead><tbody>${rows}</tbody></table></div></div>
  <div class="grid2">
    <div class="panel"><div class="panel-h"><h2>Wall elevation</h2>${wallSeg()}</div><div class="panel-b"><div class="drawing">${elevSVG(plan, S.elevWall, 'installer')}</div><p class="savestate" style="margin-top:8px">Click an item to show its distance from the screen, the rear wall, and the floor. Drag it to update the schedule.</p></div></div>
    <div class="panel"><div class="panel-h"><h2>Install sequence</h2><div style="display:flex;align-items:center;gap:8px"><span class="savestate">${done}/${sequence.length}</span><div class="progress"><i style="width:${sequence.length ? done / sequence.length * 100 : 0}%"></i></div></div></div><div class="panel-b">
      <ol class="steps">${sequence.map(([key, title, detail]) => `<li class="${checks[key] ? 'done' : ''}"><input type="checkbox" id="st_${key}" data-act="step" data-v="${key}" ${checks[key] ? 'checked' : ''} aria-label="${esc(title)}"><label for="st_${key}"><b>${esc(title)}</b><small>${esc(detail)}</small></label></li>`).join('')}</ol>
      ${S.currentId ? '' : '<p class="savestate">Save the job to keep checklist progress.</p>'}</div></div>
  </div>
  <div class="panel"><div class="panel-h"><h2>Space check carried from sales</h2>${fitPill(plan.fit)}</div><div class="panel-b">${checksHTML(plan)}</div></div>`;
}

function pricesHTML() {
  return `<div class="sheet-head"><div><h1>Price Book</h1><p>One price book drives every quote in this browser. Defaults are placeholders, not supplier pricing. Replace them with distributor cost and the sell price you want to quote.</p></div></div>
  ${PB_LABELS.map(([group, items]) => `<div class="panel"><div class="panel-h"><h2>${esc(group)}</h2></div><div class="panel-b pb-grid">${items.map(([key, label]) => `<label class="pb-row" for="pb_${key.replace(/:/g, '_')}"><span>${esc(label)}</span><input type="number" step="0.01" id="pb_${key.replace(/:/g, '_')}" data-pb="${key}" value="${S.pb[key] ?? ''}"></label>`).join('')}</div></div>`).join('')}
  <div class="actions"><button type="button" class="btn primary" data-act="savepb">Save price book</button><button type="button" class="btn" data-act="resetpb">Restore defaults</button><span class="savestate">Saved in this browser and used by every quote.</span></div>`;
}

function jobsHTML() {
  const list = [...S.jobs.entries()].sort((a, b) => (b[1].updatedAt || 0) - (a[1].updatedAt || 0));
  const grouped = {};
  list.forEach(([id, job]) => { (grouped[job.status] = grouped[job.status] || []).push([id, job]); });
  const body = list.length
    ? STATUSES.filter((status) => grouped[status]).map((status) => `<div class="panel"><div class="panel-h"><h2>${esc(status)}</h2><span class="savestate">${grouped[status].length}</span></div><div class="panel-b joblist">${grouped[status].map(([id, job]) => `<div class="jobrow"><div style="min-width:0"><b>${esc(job.name)}</b><div class="savestate">${esc(job.client || '—')} · ${esc(job.location || '—')} · ${esc(job.clientType)} · updated ${job.updatedAt ? new Date(job.updatedAt).toLocaleDateString() : '—'}</div></div><span class="status">${ftin(job.spec?.W)} × ${ftin(job.spec?.D)}</span><button type="button" class="btn" data-act="open" data-v="${id}">Open</button></div>`).join('')}</div></div>`).join('')
    : '<div class="panel"><div class="panel-b"><b>No saved jobs yet.</b><p class="savestate">Start from the example on the Sales tab, enter the client\'s room, and press Save job. Saved jobs stay in this browser, grouped by status.</p></div></div>';
  return `<div class="sheet-head"><div><h1>Jobs</h1><p>Every saved build on this browser. Open one to load its specification into all three sheets.</p></div><div class="actions"><button type="button" class="btn" data-act="export">Export JSON</button><button type="button" class="btn" data-act="import">Import JSON</button></div></div>${body}`;
}

function render() {
  document.querySelectorAll('nav.tabs button').forEach((button) => button.setAttribute('aria-selected', String(button.dataset.tab === S.tab)));
  const spec = $('#spec');
  spec.hidden = S.tab === 'prices' || S.tab === 'jobs';
  document.querySelector('main').style.gridTemplateColumns = spec.hidden ? 'minmax(0,1fr)' : '';
  const sheet = $('#sheet');
  try {
    if (S.tab === 'prices') { sheet.innerHTML = pricesHTML(); return; }
    if (S.tab === 'jobs') { sheet.innerHTML = jobsHTML(); return; }
    if (!validSpec(S.job.spec)) {
      sheet.innerHTML = '<div class="panel"><div class="panel-b">Enter a room at least 8 ft wide, 10 ft deep, and 7 ft high to draw the plan.</div></div>';
      return;
    }
    const plan = compute(S.job.spec);
    if (S.tab === 'sales') sheet.innerHTML = salesHTML(plan);
    if (S.tab === 'builder') sheet.innerHTML = builderHTML(plan);
    if (S.tab === 'installer') sheet.innerHTML = installerHTML(plan);
    fillForm();
  } catch (error) {
    sheet.innerHTML = `<div class="panel"><div class="panel-b">The plan could not be drawn from these dimensions. Check width, depth, ceiling, and screen gaps.</div></div>`;
    console.error(error);
  }
}

function readStore() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {}; }
  catch { return {}; }
}

function writeStore() {
  const jobs = {};
  S.jobs.forEach((job, id) => { jobs[id] = job; });
  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  localStorage.setItem(STORE_KEY, JSON.stringify({ jobs, pricebook: S.pb, lastId: S.currentId, theme }));
}

function setSaveState(message) {
  const node = $('#saveState');
  if (message) { node.textContent = message; return; }
  if (!S.currentId) node.textContent = S.job.example ? 'Example — not saved' : 'New — not saved';
  else node.textContent = S.dirty ? 'Unsaved changes' : 'Saved in this browser';
}

let saveTimer = 0;
function markDirty() {
  S.dirty = true;
  setSaveState();
  if (!S.currentId) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => saveJob(false), 700);
}

function jobPayload() {
  const job = S.job;
  return {
    name: job.name || 'Untitled',
    client: job.client || '',
    clientType: job.clientType,
    location: job.location || '',
    rep: job.rep || '',
    status: job.status,
    notes: job.notes || '',
    discount: +job.discount || 0,
    spec: job.spec,
    checklist: job.checklist || {},
    updatedAt: Date.now(),
    createdAt: job.createdAt || Date.now(),
  };
}

function saveJob(manual) {
  if (S.job.example) {
    S.job.example = false;
    if (String(S.job.name).startsWith('Example — ')) S.job.name = S.job.name.replace(/^Example — /, '');
  }
  const data = jobPayload();
  if (!S.currentId) S.currentId = 'job_' + Date.now().toString(36);
  S.job.createdAt = data.createdAt;
  S.job.updatedAt = data.updatedAt;
  S.jobs.set(S.currentId, { ...data, id: S.currentId });
  S.dirty = false;
  writeStore();
  fillForm();
  renderJobSel();
  setSaveState();
  if (manual) {
    render();
    toast('Job saved in this browser');
  }
}

function leaveIfDirty() {
  if (!S.dirty) return true;
  return window.confirm('This job has unsaved changes. Leave it anyway?');
}

function openJob(id) {
  const job = S.jobs.get(id);
  if (!job) return;
  if (id === S.currentId) {
    if (S.tab === 'jobs') { S.tab = 'sales'; render(); }
    return;
  }
  if (!leaveIfDirty()) { renderJobSel(); return; }
  S.currentId = id;
  S.job = JSON.parse(JSON.stringify({ ...job, spec: { ...DEFAULT_SPEC, ...job.spec, panelWalls: [...(job.spec?.panelWalls || DEFAULT_SPEC.panelWalls)] } }));
  S.dirty = false;
  fillForm();
  renderJobSel();
  setSaveState();
  if (S.tab === 'jobs') S.tab = 'sales';
  writeStore();
  render();
  try { history.replaceState(null, '', '#sales'); } catch { /* ignore */ }
}

function renderJobSel() {
  const select = $('#jobSel');
  const list = [...S.jobs.entries()].sort((a, b) => (b[1].updatedAt || 0) - (a[1].updatedAt || 0));
  let html = S.currentId ? '' : `<option value="">${esc(S.job.name)}${S.job.example ? ' (example)' : ' (unsaved)'}</option>`;
  html += list.map(([id, job]) => `<option value="${id}" ${id === S.currentId ? 'selected' : ''}>${esc(job.name)} — ${esc(job.status)}</option>`).join('');
  select.innerHTML = html || '<option>No jobs</option>';
}

function copyQuote() {
  const plan = compute(S.job.spec);
  const priced = quote(S.job.spec, plan, S.pb);
  const job = S.job;
  const text = [
    'QuickLinks Golf — Simulator proposal',
    `${job.name} · ${job.client || ''} · ${job.location || ''}`,
    `Room ${ftin(plan.W)} W × ${ftin(plan.D)} D × ${ftin(plan.H)} H · Image ${ftin(plan.img.w)} × ${ftin(plan.img.h)}`,
    '',
    ...priced.lines.map((line) => `${line.item} — ${line.qty} ${line.unit} — ${money(line.ext)}`),
    '',
    `Equipment & materials: ${money(priced.equip)}`,
    `Installation: ${money(priced.labor)}`,
    `Design + CAD: ${money(priced.design)}`,
    `Tax: ${money(priced.tax)}`,
    priced.disc ? `Discount: −${money(priced.disc)}` : '',
    `Estimated total: ${money(priced.total)}`,
  ].filter((line) => line !== '').join('\n');
  navigator.clipboard.writeText(text).then(() => toast('Quote copied')).catch(() => toast('Copy was blocked. Select the table instead.'));
}

function downloadFile(name, body, type) {
  const blob = new Blob([body], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 800);
}

function sheetCSS() {
  return `:root{--paper:#fff;--surface:#fff;--sunk:#EEF2EF;--ink:#14211A;--muted:#55665C;--line:#D2DBD4;--fair:#1B6E43;--turf:#4E9E5F;--turf2:#3B8A4D;--green:#7CC48A;--cad:#1D57A3;--backing:#C2701A;--elec:#C0262D;--data:#6B3FB3;--tube:#0E8A8A;--warn:#9A6200;--bad:#B42318;--good:#1B6E43;--wallfill:#E3E8E4;--ceil:#D9DFDA;--screen:#F7F9FA;--sky1:#8EC5EA;--sky2:#DCEFFA;--hill:#5FA36A;--fairway:#7DBF6E}
body{font-family:Helvetica,Arial,sans-serif;color:#14211A;margin:24px;font-size:12px}h1{font-size:22px;margin:0}h2{font-size:14px;text-transform:uppercase;letter-spacing:.05em;border-bottom:2px solid #14211A;padding-bottom:4px;margin-top:22px}table{border-collapse:collapse;width:100%}th,td{border-bottom:1px solid #ccc;padding:4px 6px;text-align:left;vertical-align:top}th{font-size:10px;text-transform:uppercase}.meta{color:#55665C}.n{text-align:right}svg{width:100%;height:auto}
.s-wall{fill:none;stroke:#14211A;stroke-width:5}.s-wallthin{fill:none;stroke:#14211A;stroke-width:1.5}.s-grid{stroke:#D2DBD4;stroke-width:.6}.s-turf{fill:#4E9E5F;opacity:.35}.s-green{fill:#7CC48A;opacity:.75;stroke:#3B8A4D}.s-cup{fill:#fff;stroke:#14211A}.s-mat{fill:#EEF2EF;stroke:#14211A}.s-matcut{fill:none;stroke:#B42318;stroke-dasharray:6 4}.s-strip{fill:#7CC48A;stroke:#3B8A4D}.s-light{fill:#f7f3e6;stroke:#c9a227;stroke-width:1.4}.s-screen{fill:#F7F9FA;stroke:#14211A;stroke-width:3}.s-image{fill:#DCEFFA;stroke:#1D57A3;stroke-dasharray:4 3}.s-panel{fill:#E3E8E4;stroke:#55665C}.s-equip{fill:#fff;stroke:#14211A}.s-equipfill{fill:#14211A}.s-throw{fill:#1D57A3;opacity:.08;stroke:#1D57A3;stroke-dasharray:5 4}.s-swing{fill:none;stroke:#9A6200;stroke-dasharray:3 3}.s-golfer{fill:#9A6200;opacity:.25;stroke:#9A6200}.s-ball{fill:#fff;stroke:#14211A}.s-nofix{fill:#B42318;opacity:.06;stroke:#B42318;stroke-dasharray:6 4}.s-backing{fill:#C2701A;opacity:.28;stroke:#C2701A}.s-elec{fill:#fff;stroke:#C0262D;stroke-width:1.8}.s-data{fill:#6B3FB3}.s-tube{fill:none;stroke:#0E8A8A;stroke-width:2.2;stroke-dasharray:9 5}.s-dim{stroke:#1D57A3;fill:none}.s-dimtxt{fill:#1D57A3;font-family:ui-monospace,monospace}.s-lbl,.s-lblm{fill:#14211A;font-family:Helvetica,Arial,sans-serif}.s-lblm{fill:#55665C}.s-calltxt{fill:#fff;font-family:ui-monospace,monospace}.s-floor{fill:#4E9E5F}.s-ceil{fill:#D9DFDA}.s-side{fill:#E3E8E4}.s-side2{fill:#EEF2EF}.s-sky{fill:#DCEFFA}.s-hill{fill:#5FA36A}.s-fairway{fill:#7DBF6E}.s-flag{fill:#B42318}.s-pole{stroke:#14211A}.s-tv{fill:#111;stroke:#14211A}.s-stud{stroke:#55665C;opacity:.6}.s-zone{fill:none;stroke:#55665C;stroke-dasharray:2 3}`;
}

function downloadSheet(kind) {
  const plan = compute(S.job.spec);
  const job = S.job;
  const titles = { sales: 'Simulator Proposal', builder: 'Builder Rough-In Sheet', installer: 'Installer Build Plan' };
  const head = `<h1>QuickLinks Golf — ${titles[kind]}</h1><p class="meta">${esc(job.name)} · ${esc(job.client || '')} (${esc(job.clientType)}) · ${esc(job.location || '')} · Room ${ftin(plan.W)} W × ${ftin(plan.D)} D × ${ftin(plan.H)} ceiling · Issued ${new Date().toLocaleDateString()}</p><p class="meta">X is from the left wall facing the screen. Y is from the screen wall. Planning document. Confirm on site before cutting.</p>`;
  let body = '';
  if (kind === 'sales') {
    const priced = quote(job.spec, plan, S.pb);
    body = `<h2>Your simulator</h2>${perspectiveSVG(plan)}<h2>Floor plan</h2>${planSVG(plan, 'sales')}<h2>Proposal</h2><table><tbody>${priced.lines.map((line) => `<tr><td>${esc(line.item)}</td><td class="n">${line.qty} ${line.unit}</td><td class="n">${money(line.ext)}</td></tr>`).join('')}<tr><td colspan="2">Equipment &amp; materials</td><td class="n">${money(priced.equip)}</td></tr><tr><td colspan="2">Installation</td><td class="n">${money(priced.labor)}</td></tr><tr><td colspan="2">Design + builder CAD package</td><td class="n">${money(priced.design)}</td></tr><tr><td colspan="2">Sales tax</td><td class="n">${money(priced.tax)}</td></tr>${priced.disc ? `<tr><td colspan="2">Discount</td><td class="n">−${money(priced.disc)}</td></tr>` : ''}<tr><td colspan="2"><b>Estimated total</b></td><td class="n"><b>${money(priced.total)}</b></td></tr></tbody></table>`;
  }
  if (kind === 'builder') {
    body = `<h2>Plan — backing, power, data, tubes</h2>${planSVG(plan, 'builder')}`
      + ['screen', 'left', 'right', 'rear'].map((wall) => `<h2>${cap(wall)} wall</h2>${elevSVG(plan, wall, 'builder')}`).join('')
      + `<h2>Backing schedule</h2><table><thead><tr><th>Tag</th><th>Item</th><th>Where</th><th>Spec</th><th>Size</th></tr></thead><tbody>${plan.backing.map((item) => `<tr><td>${esc(item.id)}</td><td>${esc(item.label)}</td><td>${esc(item.where)}</td><td>${esc(item.spec)}</td><td>${esc(item.size)}</td></tr>`).join('')}</tbody></table>`
      + `<h2>Electrical and data</h2><table><tbody>${plan.elec.concat(plan.data).map((item) => `<tr><td>${esc(item.id)}</td><td>${esc(item.label)}</td><td>${esc(item.spec)}</td></tr>`).join('')}</tbody></table>`
      + `<h2>Tech tubes</h2><table><tbody>${plan.tubes.map((tube) => `<tr><td>${esc(tube.id)}</td><td>${esc(tube.label)}</td><td class="n">${Math.round(tube.len)} ft</td><td>${tube.cable.len} ft ${tube.cable.aoc ? 'active optical HDMI' : 'HDMI'}</td></tr>`).join('')}</tbody></table>`;
  }
  if (kind === 'installer') {
    const places = placements(plan);
    body = `<h2>Placement plan</h2>${planSVG(plan, 'installer')}<h2>Placement schedule</h2><table><thead><tr><th>#</th><th>Item</th><th>X</th><th>Y</th><th>Height</th><th>Mount</th><th>Notes</th></tr></thead><tbody>${places.map((place, index) => `<tr><td>${index + 1}</td><td>${esc(place.item)}</td><td>${place.x == null ? '—' : ftin(place.x)}</td><td>${ftin(place.y)}</td><td>${typeof place.z === 'number' ? ftin(place.z) : esc(place.z)}</td><td>${esc(place.mount)}</td><td>${esc(place.notes)}</td></tr>`).join('')}</tbody></table>`
      + ['screen', 'left', 'right', 'rear'].map((wall) => `<h2>${cap(wall)} wall</h2>${elevSVG(plan, wall, 'installer')}`).join('')
      + `<h2>Install sequence</h2><ol>${steps(plan).map((step) => `<li><b>${esc(step[1])}</b> — ${esc(step[2])}</li>`).join('')}</ol>`;
  }
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(job.name)} — ${titles[kind]}</title><style>${sheetCSS()}</style></head><body>${head}${body}</body></html>`;
  const filename = (job.name || 'job').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-') + '-' + kind + '.html';
  downloadFile(filename, html, 'text/html');
  toast('Downloaded ' + filename);
}

function exportJSON() {
  const jobs = {};
  S.jobs.forEach((job, id) => { jobs[id] = job; });
  const payload = { schema: 'QuickLinks Sim Planner 1.0', jobs, pricebook: S.pb, exportedAt: new Date().toISOString() };
  downloadFile('quicklinks-sim-planner.json', JSON.stringify(payload, null, 2), 'application/json');
  toast('Planner JSON downloaded');
}

function importJSON(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result));
      if (!data || (data.schema && !String(data.schema).includes('QuickLinks'))) throw new Error('This file is not a QuickLinks planner export.');
      if (data.jobs && typeof data.jobs === 'object') {
        if (S.jobs.size && !window.confirm('Replace the saved jobs in this browser with the file?')) return;
        S.jobs = new Map(Object.entries(data.jobs));
      }
      if (data.pricebook && typeof data.pricebook === 'object') S.pb = { ...DEFAULT_PB, ...data.pricebook };
      S.currentId = null;
      S.job = newJob(true);
      S.dirty = false;
      writeStore();
      fillForm();
      renderJobSel();
      setSaveState();
      S.tab = 'jobs';
      render();
      toast('Planner file imported');
    } catch (error) {
      toast(error.message || 'Could not import that file.');
    }
  };
  reader.readAsText(file);
}

function applyTheme(theme, persist = true) {
  document.documentElement.setAttribute('data-theme', theme);
  const button = $('#themeBtn');
  const dark = theme === 'dark';
  if (button) {
    button.textContent = dark ? 'Light' : 'Dark';
    button.setAttribute('aria-pressed', String(dark));
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? '#0E1411' : '#F2F5F2');
  if (persist) writeStore();
}

function boot() {
  const saved = readStore();
  if (saved.pricebook) S.pb = { ...DEFAULT_PB, ...saved.pricebook };
  if (saved.jobs) Object.entries(saved.jobs).forEach(([id, job]) => S.jobs.set(id, job));
  S.job = newJob(true);
  buildForm();
  applyTheme(saved.theme || document.documentElement.getAttribute('data-theme') || 'light', false);
  const hash = (location.hash || '').slice(1);
  if (['sales', 'builder', 'installer', 'jobs', 'prices'].includes(hash)) S.tab = hash;
  if (saved.lastId && S.jobs.has(saved.lastId)) openJob(saved.lastId);
  else {
    fillForm();
    renderJobSel();
    setSaveState();
    render();
  }
}

document.addEventListener('click', (event) => {
  const target = event.target.closest('[data-act],[data-tab]');
  if (!target) return;
  if (target.dataset.tab) {
    S.tab = target.dataset.tab;
    try { history.replaceState(null, '', '#' + S.tab); } catch { /* ignore */ }
    render();
    window.scrollTo({ top: 0 });
    return;
  }
  const action = target.dataset.act;
  const value = target.dataset.v;
  if (action === 'wall') { S.elevWall = value; render(); }
  if (action === 'cv') { S.clientView = value === '1'; render(); }
  if (action === 'copyquote') copyQuote();
  if (action === 'open') openJob(value);
  if (action === 'savepb') { writeStore(); toast('Price book saved in this browser'); }
  if (action === 'resetpb') { S.pb = { ...DEFAULT_PB }; render(); toast('Defaults restored. Press Save price book to keep them.'); }
  if (action === 'export') exportJSON();
  if (action === 'import') $('#importFile').click();
  if (action === 'reset-tags') {
    delete S.job.spec.tags;
    markDirty();
    render();
    toast('Tag positions reset');
  }
  if (action && action.startsWith('dl-')) downloadSheet(action.slice(3));
});

function svgPoint(svg, clientX, clientY) {
  const matrix = svg.getScreenCTM();
  if (!matrix) return null;
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  const local = point.matrixTransform(matrix.inverse());
  return { x: local.x, y: local.y };
}

function clampNum(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function elevRoom(wall, sx, sy, plan) {
  const { W, D, H } = plan;
  let along;
  if (wall === 'screen') along = sx;
  else if (wall === 'rear') along = W - sx;
  else if (wall === 'left') along = D - sx;
  else along = sx;
  const z = H - sy;
  const x = (wall === 'rear' || wall === 'screen') ? along : (wall === 'left' ? 0 : W);
  const y = (wall === 'left' || wall === 'right') ? along : (wall === 'rear' ? D : plan.scr.y);
  return { x, y, z, along };
}

function perspRoom(drag, point, svg) {
  const camX = +svg.dataset.camx;
  const camY = +svg.dataset.camy;
  const camZ = +svg.dataset.camz;
  const sx = point.x;
  const sy = point.y;
  let depth;
  if (drag.plane === 'floor' || drag.plane === 'level') {
    const zPlane = drag.plane === 'floor' ? 0 : +drag.zval;
    if (Math.abs(sy) < 1) return null;
    depth = (camZ - zPlane) * 1000 / sy;
  } else if (drag.plane === 'x') {
    if (Math.abs(sx) < 1) return null;
    depth = (+drag.xval - camX) * 1000 / sx;
  } else if (drag.plane === 'y') {
    depth = camY - +drag.yval;
  } else return null;
  if (!(depth > 8)) return null;
  return {
    x: camX + sx * depth / 1000,
    y: camY - depth,
    z: camZ - sy * depth / 1000,
  };
}

function dragPlace(drag, plan) {
  if (drag.kind === 'ball') return { name: 'Ball', x: plan.ball.x, y: plan.ball.y, z: 0 };
  if (drag.kind === 'screen') return { name: 'Screen', x: plan.W / 2, y: plan.scr.y, z: plan.scr.z0, screenEdge: true };
  if (drag.kind === 'proj') return { name: 'Projector', x: plan.pj.x, y: plan.pj.y, z: plan.pj.z };
  if (drag.kind === 'lm') return { name: 'Launch monitor', x: plan.lm.x, y: plan.lm.y, z: plan.lm.z || 0 };
  if (drag.kind === 'cab') {
    const point = wallXY(plan.cab.wall, plan.cab.a, plan.W, plan.D);
    return { name: 'Computer', x: point.x, y: point.y, z: plan.cab.h };
  }
  if (drag.kind === 'tv') {
    const tv = plan.tvs[+drag.index];
    if (!tv) return null;
    const point = wallXY(tv.wall, tv.a, plan.W, plan.D);
    return { name: `TV ${+drag.index + 1} · ${tv.size}"`, x: point.x, y: point.y, z: tv.z };
  }
  if (drag.kind === 'cup') {
    const cup = plan.cups[+drag.index];
    if (!cup) return null;
    return { name: `Cup ${+drag.index + 1}`, x: cup.x, y: cup.y, z: 0 };
  }
  if (drag.kind === 'soffit') {
    const s = plan.soffits[+drag.index];
    if (!s) return null;
    return { name: `Soffit ${+drag.index + 1} · ${soffitWhere(s.face)}`, x: s.cx, y: s.cy, z: s.face === 'floor' ? s.z1 : s.z0 };
  }
  if (drag.kind === 'mon' && plan.mon) {
    const point = wallXY(plan.mon.wall, plan.mon.a, plan.W, plan.D);
    return { name: 'Monitor', x: point.x, y: point.y, z: plan.mon.z };
  }
  return null;
}

function dragReadout(drag, plan) {
  const place = dragPlace(drag, plan);
  if (!place) return '';
  if (place.screenEdge) {
    return `Screen ${ftin(0)} · Back wall ${ftin(plan.scr.y)} · Left ${ftin(plan.scr.x0)} · Right ${ftin(plan.W - plan.scr.x1)} · Floor ${ftin(place.z)}`;
  }
  return `${place.name} · Screen ${ftin(place.y - plan.scr.y)} · Left ${ftin(place.x)} · Right ${ftin(plan.W - place.x)} · Floor ${ftin(place.z)}`;
}

function showDragRead(drag, clientX, clientY) {
  const text = dragReadout(drag, compute(S.job.spec));
  let node = document.getElementById('dragRead');
  if (!text) {
    if (node) node.hidden = true;
    return;
  }
  if (!node) {
    node = document.createElement('div');
    node.id = 'dragRead';
    node.className = 'dragread';
    document.body.appendChild(node);
  }
  node.textContent = text;
  node.hidden = false;
  const width = node.offsetWidth || 280;
  const left = Math.min(Math.max(8, clientX + 16), window.innerWidth - width - 8);
  const top = Math.max(8, clientY - node.offsetHeight - 14);
  node.style.left = left + 'px';
  node.style.top = top + 'px';
}

function hideDragRead() {
  const node = document.getElementById('dragRead');
  if (node) node.hidden = true;
}

function applyDrag(drag, point, svg) {
  const spec = S.job.spec;
  const plan = compute(spec);
  const inch = (value) => Math.round(value);
  let x = point.x;
  let y = point.y;
  let z = null;
  if (drag.view === 'elev') {
    const mapped = elevRoom(drag.wall, point.x, point.y, plan);
    x = mapped.x;
    y = mapped.y;
    z = mapped.z;
  } else if (drag.view === 'persp') {
    const mapped = perspRoom(drag, point, svg);
    if (!mapped) return;
    x = mapped.x;
    y = mapped.y;
    z = mapped.z;
  }
  if (drag.kind === 'ball') {
    const mat = matOf(spec.mat);
    const nextY = clampNum(inch(y), plan.scr.y + mat.d / 2 + 6, plan.D - mat.d / 2 - 12);
    spec.teeDist = Math.round(nextY - plan.scr.y);
    if (drag.view !== 'elev') {
      const nextX = clampNum(inch(x), mat.w / 2 + 6, plan.W - mat.w / 2 - 6);
      spec.ballX = Math.round(nextX - plan.W / 2);
    }
  } else if (drag.kind === 'screen' && drag.view === 'plan') {
    const ballAbs = plan.ball.y;
    const next = clampNum(inch(y), 0, Math.max(0, ballAbs - 48));
    spec.screenOffset = Math.round(next);
    spec.teeDist = Math.round(ballAbs - next);
  } else if (drag.kind === 'proj') {
    const next = clampNum(inch(y), plan.scr.y + 18, plan.D - 14);
    const width = Math.max(1, plan.img.w);
    spec.tr = Math.round(((next - plan.scr.y) / width) * 100) / 100;
    const preset = projOf(spec.proj).tr;
    if (spec.proj !== 'custom' && Math.abs(spec.tr - preset) > 0.02) spec.proj = 'custom';
    if (z != null && drag.plane !== 'level' && drag.plane !== 'floor') spec.projDrop = Math.round(clampNum(plan.H - z, 0, Math.max(0, plan.H - 36)));
  } else if (drag.kind === 'lm') {
    const launch = lmOf(spec.lm);
    const next = clampNum(inch(y), plan.scr.y + 18, plan.D - 12);
    if (launch.type === 'overhead') spec.lmAdj = Math.round(next - plan.ball.y - (launch.offY || 0));
    else spec.lmAdj = Math.round(next - plan.ball.y - 96);
  } else if (drag.kind === 'cab') {
    const cab = plan.cab;
    const along = (drag.view === 'elev' && (drag.wall === 'rear' || drag.wall === 'screen')) || (drag.view !== 'elev' && cab.wall === 'rear') ? x : y;
    if (cab.wall === 'rear') spec.compPos = Math.round(clampNum(along, cab.w / 2, plan.W - cab.w / 2) - cab.w / 2);
    else spec.compPos = Math.round(plan.D - clampNum(along, plan.scr.y + cab.w / 2, plan.D - cab.w / 2) - cab.w / 2);
  } else if (drag.kind === 'tv') {
    ensureTvs(spec);
    const item = spec.tvs[+drag.index];
    const drawn = plan.tvs[+drag.index];
    if (!item || !drawn) return;
    if (drag.view === 'plan') {
      if (x <= 30) item.wall = 'left';
      else if (x >= plan.W - 30) item.wall = 'right';
    }
    const wall = item.wall === 'right' || item.wall === 'rear' ? item.wall : 'left';
    const width = Math.min(98, Math.max(32, +item.size || drawn.size)) * 0.872;
    const along = wall === 'rear' ? x : y;
    const minAlong = wall === 'rear' ? width / 2 : plan.scr.y + width / 2;
    const maxAlong = wall === 'rear' ? plan.W - width / 2 : plan.D - width / 2;
    item.pos = Math.round(clampNum(along, minAlong, maxAlong));
    if (z != null) {
      const height = width / 0.872 * 0.49;
      item.z = Math.round(clampNum(z, height / 2 + 6, plan.H - height / 2 - 6));
    }
  } else if (drag.kind === 'cup') {
    const cup = plan.cups[+drag.index];
    if (!cup) return;
    if (!Array.isArray(spec.cupPos)) spec.cupPos = [];
    const sideOnly = drag.view === 'elev' && (drag.wall === 'left' || drag.wall === 'right');
    const nextX = sideOnly ? cup.x : x;
    const nextY = drag.view === 'elev' && (drag.wall === 'screen' || drag.wall === 'rear') ? cup.y : y;
    spec.cupPos[+drag.index] = {
      x: Math.round(clampNum(nextX, 10, plan.W - 10)),
      y: Math.round(clampNum(nextY, plan.scr.y + 8, plan.D - 10)),
    };
  } else if (drag.kind === 'soffit') {
    ensureSoffits(spec);
    const item = spec.soffits[+drag.index];
    const drawn = plan.soffits[+drag.index];
    if (!item || !drawn) return;
    const sideElev = drag.view === 'elev' && (drag.wall === 'left' || drag.wall === 'right');
    const endElev = drag.view === 'elev' && (drag.wall === 'screen' || drag.wall === 'rear');
    if (drawn.face === 'left' || drawn.face === 'right') {
      if (endElev) return;
      const span = drawn.y1 - drawn.y0;
      item.pos = Math.round(clampNum(y, span / 2, plan.D - span / 2));
    } else if (drawn.face === 'screen') {
      if (sideElev) return;
      const span = drawn.x1 - drawn.x0;
      item.pos = Math.round(clampNum(x, span / 2, plan.W - span / 2));
    } else {
      const span = drawn.x1 - drawn.x0;
      const depth = drawn.y1 - drawn.y0;
      if (!sideElev) item.pos = Math.round(clampNum(x, span / 2, plan.W - span / 2));
      if (!endElev) item.posY = Math.round(clampNum(y, depth / 2, plan.D - depth / 2));
    }
  } else if (drag.kind === 'mon' && plan.mon) {
    const along = plan.mon.wall === 'rear' ? x : y;
    spec.monAlong = Math.round(clampNum(along, 12, plan.mon.wall === 'rear' ? plan.W - 12 : plan.D - 12));
    if (z != null) spec.monZ = Math.round(clampNum(z, plan.mon.h / 2 + 6, plan.H - plan.mon.h / 2 - 6));
  } else if (drag.kind === 'tag' && drag.id && drag.view === 'plan') {
    if (!spec.tags) spec.tags = {};
    spec.tags[drag.id] = {
      x: Math.round(clampNum(x, -12, plan.W + 12)),
      y: Math.round(clampNum(y, -12, plan.D + 12)),
    };
  } else return;
  markDirty();
  scheduleRender();
}

let planDrag = null;
let guideFocus = null;
function dragSvg(drag) {
  if (drag.view === 'persp') return document.querySelector('#sheet svg[data-view="persp"]');
  if (drag.view === 'elev') return document.querySelector(`#sheet svg[data-view="elev"][data-wall="${drag.wall}"]`);
  return document.querySelector('#sheet svg[data-view="plan"]');
}
document.addEventListener('pointerdown', (event) => {
  if (!['sales', 'builder', 'installer'].includes(S.tab) || event.button != null && event.button !== 0) return;
  const handle = event.target.closest && event.target.closest('[data-drag]');
  if (!handle || !handle.closest('#sheet')) {
    if (guideFocus) {
      guideFocus = null;
      scheduleRender();
    }
    return;
  }
  const svg = handle.closest('svg');
  if (!svg) return;
  event.preventDefault();
  planDrag = {
    kind: handle.dataset.drag,
    id: handle.dataset.id || '',
    index: handle.dataset.i || '0',
    pointerId: event.pointerId,
    view: svg.dataset.view || 'plan',
    wall: svg.dataset.wall || '',
    plane: handle.dataset.plane || '',
    zval: handle.dataset.zval || '',
    xval: handle.dataset.xval || '',
    yval: handle.dataset.yval || '',
  };
  guideFocus = planDrag.kind === 'tag' ? null : {
    kind: planDrag.kind,
    index: planDrag.index,
    view: planDrag.view,
    wall: planDrag.wall,
  };
  document.body.classList.add('dragging');
  showDragRead(planDrag, event.clientX, event.clientY);
  scheduleRender();
});
document.addEventListener('pointermove', (event) => {
  if (!planDrag || event.pointerId !== planDrag.pointerId) return;
  const svg = dragSvg(planDrag);
  if (!svg) return;
  const point = svgPoint(svg, event.clientX, event.clientY);
  if (!point) return;
  applyDrag(planDrag, point, svg);
  showDragRead(planDrag, event.clientX, event.clientY);
});
function endPlanDrag(event) {
  if (!planDrag || event.pointerId !== planDrag.pointerId) return;
  planDrag = null;
  document.body.classList.remove('dragging');
  hideDragRead();
  scheduleRender();
}
document.addEventListener('pointerup', endPlanDrag);
document.addEventListener('pointercancel', endPlanDrag);

document.addEventListener('change', (event) => {
  const target = event.target;
  if (target.dataset.act === 'step') {
    S.job.checklist = { ...(S.job.checklist || {}), [target.dataset.v]: target.checked };
    markDirty();
    render();
  }
  if (target.dataset.pb) S.pb[target.dataset.pb] = +target.value;
});

let priceTimer = 0;
document.addEventListener('input', (event) => {
  if (!event.target.dataset.pb) return;
  S.pb[event.target.dataset.pb] = +event.target.value;
  clearTimeout(priceTimer);
  priceTimer = setTimeout(writeStore, 400);
});

$('#jobSel').addEventListener('change', (event) => { if (event.target.value) openJob(event.target.value); });
$('#newBtn').addEventListener('click', () => {
  if (!leaveIfDirty()) return;
  S.currentId = null;
  S.job = newJob(false);
  S.dirty = false;
  fillForm();
  renderJobSel();
  setSaveState();
  S.tab = 'sales';
  render();
});
$('#dupBtn').addEventListener('click', () => {
  if (S.dirty && !window.confirm('Duplicate the job as it is now, including unsaved edits?')) return;
  const copy = JSON.parse(JSON.stringify(S.job));
  copy.name = (copy.name || 'Job') + ' (copy)';
  copy.example = false;
  copy.checklist = {};
  copy.status = 'Lead';
  delete copy.createdAt;
  delete copy.updatedAt;
  S.currentId = null;
  S.job = copy;
  S.dirty = true;
  fillForm();
  renderJobSel();
  setSaveState();
  render();
  toast('Duplicated. Press Save job to keep it.');
});
$('#saveBtn').addEventListener('click', () => { clearTimeout(saveTimer); saveJob(true); });
$('#printBtn').addEventListener('click', () => window.print());
$('#themeBtn').addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});
$('#importFile').addEventListener('change', (event) => {
  const file = event.target.files && event.target.files[0];
  event.target.value = '';
  if (file) importJSON(file);
});

boot();
