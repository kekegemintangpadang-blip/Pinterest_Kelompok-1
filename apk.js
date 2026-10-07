const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const CAT={semua:'Semua',kota:'Kota',arsitektur:'Arsitektur',alam:'Alam',pantai:'Pantai & Laut',fotografi:'Fotografi','dekorasi-rumah':'Dekorasi Rumah',resep:'Resep',fashion:'Fashion',travel:'Travel',seni:'Seni',teknologi:'Teknologi',tanaman:'Tanaman'};
const DESC={kota:'Suasana kota yang penuh cerita dan warna.',arsitektur:'Inspirasi bangunan dan arsitektur yang menarik untuk dilihat.',alam:'Keindahan alam yang menenangkan, cocok jadi inspirasi.',pantai:'Pantai dan laut yang bikin betah berlama-lama.',fotografi:'Hasil jepretan yang bisa jadi referensi foto kamu.','dekorasi-rumah':'Ide dekorasi rumah yang simpel dan nyaman ditiru.',resep:'Resep praktis yang bisa langsung dicoba di rumah.',fashion:'Padu padan outfit yang simpel dan enak dipakai.',travel:'Destinasi cantik untuk masuk daftar perjalananmu.',seni:'Karya dan inspirasi seni untuk memancing kreativitas.',teknologi:'Ide setup dan teknologi supaya kerja lebih nyaman.',tanaman:'Tips dan ide tanaman untuk mempercantik ruangan.'};

/* [id, judul, kategori, tinggi gambar, ukuran kartu] */
const BASE=[
['p1','Rumah kuning dan sepeda tua','kota',600,'s3'],
['p10','Tanduk putih di langit malam','fotografi',600,'s3'],
['p14','Lorong kota tua dengan jemuran','kota',590,'s3'],
['p2','Bangunan beton bergaya brutalis','arsitektur',300,'s1'],
['p9','Rel kereta di tengah hutan','alam',460,'s2'],
['p3','Pantai berpasir dan laut tenang','pantai',450,'s2'],
['p4','Mobil klasik di depan garasi kuning','kota',700,'s4'],
['p12','Secangkir kopi hangat','fotografi',690,'s4'],
['p7','Cahaya senja di tengah hutan','alam',310,'s1'],
['p13','Gereja klasik dari sudut bawah','arsitektur',440,'s2'],
['p15','Gedung pencakar langit kota','kota',320,'s1'],
['p5','Jerami di ladang berkabut','alam',420,'s2'],
['p6','Gedung hijau dari sudut bawah','arsitektur',580,'s3'],
['p8','Jejak bintang di langit malam','fotografi',680,'s4'],
['p11','Tebing dan laut biru','pantai',300,'s1'],
['p16','Laguna biru berasap','pantai',450,'s2']
].map(([id,title,cat,h,s])=>({id,title,cat,s,src:`https://picsum.photos/seed/${id}/400/${h}`}));

/* pin lama (gambar di folder images/) tetap dipakai */
const OLD=[
['Ide kamar tidur minimalis','dekorasi-rumah','kamar-tidur','s3'],
['Ruang tamu warna netral','dekorasi-rumah','ruang-tamu','s3'],
['Desain interior kafe','dekorasi-rumah','kafe','s3'],
['Sarapan sehat 10 menit','resep','sarapan','s1'],
['Resep nasi goreng spesial','resep','nasi-goreng','s2'],
['Outfit kuliah simpel','fashion','outfit','s2'],
['Pemandangan Danau Toba','travel','danau-toba','s4'],
['Gunung dan kabut pagi','travel','gunung-kabut','s4'],
['Inspirasi poster minimalis','seni','poster','s1'],
['Ilustrasi digital lucu','seni','ilustrasi','s2'],
['Palet warna pastel','seni','palet','s1'],
['Setup meja kerja aesthetic','teknologi','meja-kerja','s2'],
['Tanaman hias untuk pemula','tanaman','tanaman','s3'],
['Foto langit senja','fotografi','senja','s4'],
['Kopi dan buku','fotografi','kopi-buku','s1'],
['Tips fotografi pemula','fotografi','fotografi','s2']
].map(([title,cat,img,s],i)=>({id:'o'+(i+1),title,cat,s,src:`images/${img}.svg`,fb:`https://picsum.photos/seed/old${i+1}/400/500`}));
BASE.push(...OLD);
const fbk=p=>p.fb?` onerror="this.onerror=null;this.src='${p.fb}'"`:'';
const hash=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))>>>0;return h};
const AUTHORS=['Asakura Hirai','Rina Putri','Dimas Arya','Nadia Safitri','Budi Santoso','Maya Lestari'];
const SEEDC=[['Rina','Bagus banget, jadi pengen coba!'],['Dimas','Inspirasi banget nih 🔥'],['Nadia','Disimpan ya, makasih udah share'],['Budi','Warnanya cakep, ada yang serupa?']];

/* penyimpanan */
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=t=>new Date(t).toLocaleString('id-ID',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});

const st={
  cat:'semua',q:'',view:'home',curBoard:null,
  saved:ld('saved',{}),extra:ld('extra',[]),hidden:ld('hidden',[]),
  boards:ld('boards',['Inspirasi','Ide Tugas','Favorit']),
  board:ld('board',null),
  notifs:ld('notifs',[
    {t:Date.now()-60000,m:'Selamat datang di Pinterest! Mulai simpan ide-idemu.'},
    {t:Date.now()-30000,m:'Arahkan kursor ke pin lalu tekan Simpan untuk memasukkannya ke papan.'}
  ]),
  unread:ld('unread',2),
  msgs:ld('msgs',[{t:'Halo! Ini kotak pesanmu. Tulis sesuatu, aku akan membalas 😊'}]),
  dark:ld('dark',false),
  likes:ld('likes',{}),cmts:ld('cmts',{}),stack:[]
};
if(!st.board||!st.boards.includes(st.board))st.board=st.boards[0];

/* extra (pin buatan) paling baru tampil di atas */
const all=()=>[...st.extra.slice().reverse(),...BASE].filter(p=>!st.hidden.includes(p.id));

/* notifikasi */
function dot(){$$('[data-nav="notif"]').forEach(n=>n.classList.toggle('has-dot',st.unread>0))}
function notify(m){
  st.notifs.unshift({t:Date.now(),m});st.notifs=st.notifs.slice(0,20);st.unread++;
  sv('notifs',st.notifs);sv('unread',st.unread);dot();
}
function applyDark(){document.body.classList.toggle('dark',!!st.dark)}

/* tampilan pin */
function card(p){
  const s=st.saved[p.id];
  return `<article class="pin ${p.s}" data-id="${p.id}"><div class="media"><img src="${p.src}" alt="${esc(p.title)}" loading="lazy"${fbk(p)}><div class="overlay"><div class="top"><button class="board" data-act="board">${esc(s||st.board)} ▾</button><button class="save ${s?'saved':''}" data-act="save">${s?'Tersimpan':'Simpan'}</button></div><div class="bottom"><span class="circle" data-act="share">↗</span><span class="circle" data-act="menu">•••</span></div></div></div><div class="meta"><span class="title">${esc(p.title)}</span><span class="more" data-act="menu">•••</span></div></article>`;
}
function render(){
  const v=st.view,b=st.curBoard,showBoards=v==='boards'&&!b;
  $('#grid').hidden=showBoards;
  $('#boards').hidden=!showBoards;
  $('.categories').style.display=(v==='profile'||v==='boards')?'none':'';

  /* judul + tombol di atas daftar */
  const h=$('#heading'),act=$('#hact');
  h.hidden=!(v==='profile'||v==='boards');
  $('#htitle').textContent=v==='profile'?'Pin Tersimpan':b?'Papan: '+b:'Papan Saya';
  $('#hback').hidden=!b;
  act.hidden=!(v==='profile'||showBoards);
  act.dataset.do=v==='profile'?'settings':'newboard';
  act.textContent=v==='profile'?'⚙ Pengaturan':'+ Buat papan';

  if(showBoards){
    $('#boards').innerHTML=st.boards.map(n=>{
      const ps=all().filter(p=>st.saved[p.id]===n);
      return `<div class="bcard" data-board="${esc(n)}"><div class="cover">${ps.slice(0,3).map(p=>`<img src="${p.src}" alt="">`).join('')||'<span class="muted">Belum ada pin</span>'}</div><b>${esc(n)}</b><small class="muted">${ps.length} pin</small></div>`;
    }).join('');
    return;
  }

  let l=all();
  if(v==='profile')l=l.filter(p=>st.saved[p.id]);
  else if(v==='boards')l=l.filter(p=>st.saved[p.id]===b);
  else{
    if(st.cat!=='semua')l=l.filter(p=>p.cat===st.cat);
    if(v==='explore')l=l.slice().reverse();
  }
  const q=st.q.trim().toLowerCase();
  if(q)l=l.filter(p=>(p.title+' '+CAT[p.cat]).toLowerCase().includes(q));
  const none=(v==='profile'||v==='boards')&&!q?'Belum ada pin tersimpan. Tekan Simpan pada pin yang kamu suka.':'Tidak ada pin yang cocok.';
  $('#grid').innerHTML=l.length?l.map(card).join(''):`<p class="empty">${none}</p>`;
}

/* toast, menu, modal */
let tt;
function toast(m){$$('.toast').forEach(x=>x.remove());const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);clearTimeout(tt);tt=setTimeout(()=>t.remove(),2200)}
const closeMenu=()=>$$('.menu').forEach(m=>m.remove());
function menu(html,el,fn,side){
  closeMenu();const m=document.createElement('div');m.className='menu';m.innerHTML=html;document.body.appendChild(m);
  const r=el.getBoundingClientRect();
  const top=side?r.top:r.bottom+6,left=side?r.right+8:r.left;
  m.style.top=Math.max(8,Math.min(top,innerHeight-m.offsetHeight-8))+'px';
  m.style.left=Math.max(8,Math.min(left,innerWidth-m.offsetWidth-8))+'px';
  m.onclick=e=>{const b=e.target.closest('button');if(b&&fn){closeMenu();fn(b.dataset.v)}};
}
const closeModal=()=>$$('.backdrop').forEach(m=>m.remove());
function modal(html){
  closeModal();const b=document.createElement('div');b.className='backdrop';
  b.innerHTML=`<div class="modal"><button class="x" aria-label="Tutup">×</button>${html}</div>`;
  b.onclick=e=>{if(e.target===b||e.target.closest('.x'))closeModal()};
  document.body.appendChild(b);return b;
}
addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeMenu()}});

/* aksi pin */
function toggleSave(id,board){
  const p=all().find(x=>x.id===id);
  if(board){st.saved[id]=board;st.board=board;sv('board',board);toast('Disimpan di papan '+board);if(p)notify(`Kamu menyimpan "${p.title}" ke papan ${board}`)}
  else if(st.saved[id]){delete st.saved[id];toast('Pin dihapus dari papan')}
  else{st.saved[id]=st.board;toast('Disimpan di papan '+st.board);if(p)notify(`Kamu menyimpan "${p.title}" ke papan ${st.board}`)}
  sv('saved',st.saved);render();
  if($('.detail'))openDetail(id,'keep');
}
const authorOf=p=>p.me?'Kamu':AUTHORS[hash(p.id)%AUTHORS.length];
const likeCount=p=>20+hash(p.id+'l')%880+(st.likes[p.id]?1:0);
const commentsOf=id=>[...SEEDC.slice(0,hash(id+'c')%4).map(([u,t])=>({u,t})),...(st.cmts[id]||[])];

/* mode: 'new' dari grid, 'push' dari pin terkait, 'pop' kembali, 'keep' muat ulang tanpa lompat */
function openDetail(id,mode='new'){
  const p=all().find(x=>x.id===id);if(!p)return;
  const cur=$('.detail'),old=$('.modal'),sc=mode==='keep'&&old?old.scrollTop:0;
  if(mode==='new')st.stack=[];
  else if(mode==='push'&&cur)st.stack.push(cur.dataset.id);
  const s=st.saved[id],liked=st.likes[id],cm=commentsOf(id);
  const rel=all().filter(x=>x.id!==id).sort((a,b)=>hash(id+a.id)-hash(id+b.id)).slice(0,12);
  const b=modal(`<div class="detail" data-id="${id}">
    <button class="dback" data-do="dback" aria-label="Kembali">←</button>
    <img class="dimg" src="${p.src}" alt="${esc(p.title)}"${fbk(p)}>
    <div class="dinfo">
      <div class="dbar">
        <button class="ibtn ${liked?'liked':''}" data-act="like">${liked?'♥':'♡'} ${likeCount(p)}</button>
        <button class="ibtn" data-act="focuscmt" aria-label="Komentar">💬</button>
        <button class="ibtn" data-act="share" aria-label="Bagikan">↗</button>
        <button class="ibtn" data-act="menu" aria-label="Lainnya">•••</button>
        <span class="grow"></span>
        <button class="dboard" data-act="board">${esc(s||st.board)} ▾</button>
        <button class="save ${s?'saved':''}" data-act="save">${s?'Tersimpan':'Simpan'}</button>
      </div>
      <div class="dauthor"><span class="av">${esc(authorOf(p)[0])}</span>${esc(authorOf(p))}</div>
      <h2>${esc(p.title)}</h2>
      <h3>Description</h3>
      <p class="muted">${esc(p.desc||DESC[p.cat])}</p>
      <p class="muted">Kategori: ${CAT[p.cat]}${s?' • Papan: '+esc(s):''}</p>
      <button class="ctoggle" data-act="togglecmt">${cm.length} Komentar <span>⌄</span></button>
      <div class="clist">${cm.length?cm.map(c=>`<div class="cm"><span class="av">${esc(c.u[0])}</span><div><b>${esc(c.u)}</b> ${esc(c.t)}</div></div>`).join(''):'<p class="muted">Belum ada komentar. Jadi yang pertama!</p>'}</div>
      <form id="cmform" class="cin"><input id="cmi" placeholder="Tambahkan komentar" autocomplete="off" maxlength="200"><button class="save">Kirim</button></form>
    </div></div>
    <h3 class="reltitle">Pin lainnya untukmu</h3>
    <div class="rel">${rel.map(x=>`<div class="ri" data-open="${x.id}"><img src="${x.src}" alt="${esc(x.title)}" loading="lazy"${fbk(x)}><span>${esc(x.title)}</span></div>`).join('')}</div>`);
  const md=$('.modal',b);md.classList.add('wide');md.scrollTop=sc;
  $('#cmform',b).onsubmit=e=>{
    e.preventDefault();
    const t=$('#cmi',b).value.trim();if(!t)return;
    (st.cmts[id]=st.cmts[id]||[]).push({u:'Kamu',t});sv('cmts',st.cmts);
    notify(`Kamu berkomentar di "${p.title}"`);
    openDetail(id,'keep');$('#cmi').focus();
  };
}
function act(a){
  const id=a.closest('[data-id]').dataset.id,type=a.dataset.act;
  if(type==='save')toggleSave(id);
  else if(type==='like'){if(st.likes[id])delete st.likes[id];else st.likes[id]=1;sv('likes',st.likes);openDetail(id,'keep')}
  else if(type==='focuscmt'){const i=$('#cmi');if(i)i.focus()}
  else if(type==='togglecmt'){const l=$('.clist');if(l)l.hidden=!l.hidden}
  else if(type==='board')menu(st.boards.map(b=>`<button data-v="${esc(b)}">${esc(b)}</button>`).join(''),a,b=>toggleSave(id,b));
  else if(type==='share'){try{navigator.clipboard.writeText(location.href.split('#')[0]+'#pin-'+id)}catch{}toast('Tautan pin disalin')}
  else if(type==='menu')menu('<button data-v="dl">Unduh gambar</button><button data-v="hide">Sembunyikan pin</button>',a,v=>{
    const p=all().find(x=>x.id===id);
    if(v==='dl'){
      fetch(p.src).then(r=>r.blob()).then(bl=>{const l=document.createElement('a');l.href=URL.createObjectURL(bl);l.download=p.title+'.jpg';l.click();toast('Mengunduh gambar')}).catch(()=>window.open(p.src,'_blank'));
    }else{st.hidden.push(id);sv('hidden',st.hidden);closeModal();render();toast('Pin disembunyikan')}
  });
}

/* ===== FITUR SIDEBAR ===== */

/* Notifikasi (lonceng) */
function openNotif(el){
  st.unread=0;sv('unread',0);dot();
  const rows=st.notifs.length
    ?st.notifs.map(n=>`<div class="row">${esc(n.m)}<small class="muted">${fmt(n.t)}</small></div>`).join('')+'<button data-v="clear">Hapus semua</button>'
    :'<div class="row muted">Belum ada notifikasi.</div>';
  menu('<div class="row"><b>Notifikasi</b></div>'+rows,el,v=>{
    if(v==='clear'){st.notifs=[];sv('notifs',[]);toast('Notifikasi dihapus')}
  },true);
}

/* Pesan (chat) */
function botReply(t){
  t=t.toLowerCase();
  if(/halo|hai|hi\b/.test(t))return 'Halo juga! Ada yang bisa dibantu?';
  if(/simpan|papan/.test(t))return 'Tekan Simpan pada pin, lalu cek semua pinmu di menu Papan.';
  if(/buat|upload|unggah/.test(t))return 'Tekan ikon + di sidebar untuk membuat pin barumu.';
  return 'Terima kasih pesannya! 😊';
}
function openMessages(){
  const m=modal('<h2>Pesan</h2><div class="chat" id="chat"></div><form id="mform" class="mform"><input id="mi" placeholder="Tulis pesan…" autocomplete="off" required><button class="save">Kirim</button></form>');
  const chat=$('#chat',m);
  const draw=()=>{chat.innerHTML=st.msgs.map(x=>`<div class="bub ${x.me?'me':''}">${esc(x.t)}</div>`).join('');chat.scrollTop=chat.scrollHeight};
  draw();
  $('#mform',m).onsubmit=e=>{
    e.preventDefault();
    const i=$('#mi',m),t=i.value.trim();if(!t)return;
    st.msgs.push({me:1,t});i.value='';draw();sv('msgs',st.msgs);
    setTimeout(()=>{
      st.msgs.push({t:botReply(t)});st.msgs=st.msgs.slice(-50);sv('msgs',st.msgs);
      if(chat.isConnected)draw();
    },700);
  };
  $('#mi',m).focus();
}

/* Pengaturan (roda gigi) */
function openSettings(){
  const m=modal(`<h2>Pengaturan</h2><div class="set">
    <label class="srow"><span>Mode gelap</span><input type="checkbox" id="sdark" ${st.dark?'checked':''}></label>
    <button class="sbtn" data-s="unhide">Tampilkan lagi pin yang disembunyikan (${st.hidden.length})</button>
    <button class="sbtn" data-s="clearsaved">Hapus semua pin tersimpan (${Object.keys(st.saved).length})</button>
    <button class="sbtn" data-s="clearextra">Hapus pin buatanku (${st.extra.length})</button>
    <button class="sbtn danger" data-s="reset">Reset semua data</button>
  </div>`);
  $('#sdark',m).onchange=e=>{st.dark=e.target.checked;sv('dark',st.dark);applyDark()};
  $$('.sbtn',m).forEach(b=>b.onclick=()=>{
    const k=b.dataset.s;
    if(k==='unhide'){st.hidden=[];sv('hidden',[]);toast('Pin ditampilkan lagi')}
    else if(k==='clearsaved'){if(!confirm('Hapus semua pin tersimpan?'))return;st.saved={};sv('saved',{});toast('Pin tersimpan dihapus')}
    else if(k==='clearextra'){if(!confirm('Hapus semua pin buatanmu?'))return;st.extra.forEach(p=>delete st.saved[p.id]);st.extra=[];sv('extra',[]);sv('saved',st.saved);toast('Pin buatanmu dihapus')}
    else if(k==='reset'){if(!confirm('Reset semua data (pin tersimpan, papan, pesan, pengaturan)?'))return;try{localStorage.clear()}catch{}location.reload();return}
    closeModal();render();
  });
}

/* Papan baru */
function openNewBoard(){
  const m=modal('<h2>Buat Papan</h2><form id="bform" class="cform"><input id="bn" placeholder="Nama papan" maxlength="30" required><button class="save">Buat</button></form>');
  $('#bn',m).focus();
  $('#bform',m).onsubmit=e=>{
    e.preventDefault();
    const n=$('#bn',m).value.trim();
    if(!n)return;
    if(st.boards.some(b=>b.toLowerCase()===n.toLowerCase()))return toast('Nama papan sudah ada');
    st.boards.push(n);sv('boards',st.boards);closeModal();render();toast('Papan "'+n+'" dibuat');
  };
}

/* Buat pin */
function openCreate(){
  const m=modal(`<h2>Buat Pin</h2><form id="cform" class="cform"><input id="ct" placeholder="Judul pin" maxlength="60" required><textarea id="cd" placeholder="Deskripsi (opsional)" maxlength="300" rows="3"></textarea><select id="cc">${Object.keys(CAT).filter(k=>k!=='semua').map(k=>`<option value="${k}">${CAT[k]}</option>`).join('')}</select><input id="cimg" type="file" accept="image/*" required><img id="pv" alt="" hidden><button class="save">Terbitkan</button></form>`);
  let data=null;
  $('#cimg',m).onchange=e=>{
    const f=e.target.files[0];if(!f)return;
    const im=new Image();
    im.onload=()=>{
      const k=Math.min(1,600/im.width),c=document.createElement('canvas');
      c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);
      c.getContext('2d').drawImage(im,0,0,c.width,c.height);
      data={src:c.toDataURL('image/jpeg',.8),r:c.height/c.width};
      const pv=$('#pv',m);pv.src=data.src;pv.hidden=false;
    };
    im.src=URL.createObjectURL(f);
  };
  $('#cform',m).onsubmit=e=>{
    e.preventDefault();
    if(!data)return toast('Tunggu gambar selesai dimuat');
    const r=data.r,s=r<.9?'s1':r<1.3?'s2':r<1.7?'s3':'s4',title=$('#ct',m).value.trim();
    st.extra.push({id:'u'+Date.now(),title,cat:$('#cc',m).value,src:data.src,s,desc:$('#cd',m).value.trim(),me:true});
    sv('extra',st.extra);closeModal();notify(`Pin "${title}" berhasil diterbitkan`);
    st.q='';$('.search input').value='';setCat('semua');go('home');toast('Pin berhasil dibuat');
  };
}

/* navigasi */
function go(v,el){
  if(v==='create')return openCreate();
  if(v==='notif')return openNotif(el);
  if(v==='messages')return openMessages();
  if(v==='settings')return openSettings();
  st.view=v;st.curBoard=null;
  $$('[data-nav]').forEach(n=>n.classList.toggle('active',n.dataset.nav===v));
  render();scrollTo({top:0,behavior:'smooth'});
}
function setCat(c){
  st.cat=c;
  $$('.chip').forEach(x=>x.classList.toggle('active',x.dataset.category===c));
  render();
}
function doAct(x){
  if(x==='back'){st.curBoard=null;render()}
  else if(x==='dback'){const pr=st.stack.pop();pr?openDetail(pr,'pop'):closeModal()}
  else if(x==='newboard')openNewBoard();
  else if(x==='settings')openSettings();
}

document.addEventListener('click',e=>{
  const t=e.target;
  if(t.closest('a'))e.preventDefault();
  if(!t.closest('.menu'))closeMenu();
  const d=t.closest('[data-do]');
  if(d)return doAct(d.dataset.do);
  const a=t.closest('[data-act]');
  if(a){e.stopPropagation();return act(a)}
  const n=t.closest('[data-nav]');
  if(n)return go(n.dataset.nav,n);
  if(t.closest('.logo'))return go('home');
  if(t.closest('.avatar'))return go('profile');
  const c=t.closest('.chip');
  if(c)return setCat(c.dataset.category);
  const bc=t.closest('.bcard');
  if(bc){st.curBoard=bc.dataset.board;render();scrollTo({top:0});return}
  const ri=t.closest('[data-open]');
  if(ri)return openDetail(ri.dataset.open,'push');
  const m=t.closest('.media');
  if(m)return openDetail(m.closest('.pin').dataset.id);
  if(t.closest('.help-btn'))modal('<h2>Bantuan</h2><p>• Klik kategori untuk menyaring pin.<br>• Ketik di kolom Cari untuk mencari.<br>• Arahkan kursor ke pin lalu tekan Simpan, atau pilih papan dulu.<br>• Klik pin untuk melihat detailnya.<br>• 🧭 Jelajahi: tampilan pin dengan urutan lain.<br>• ▦ Papan: lihat dan buat papan koleksimu.<br>• ＋ Buat: unggah pin sendiri.<br>• 🔔 Notifikasi: riwayat aktivitasmu.<br>• 💬 Pesan: kotak chat.<br>• ⚙ Pengaturan: mode gelap dan reset data.<br>• Klik avatar (K) untuk melihat pin tersimpan.</p>');
});
$('.search input').addEventListener('input',e=>{st.q=e.target.value;render()});

$('.categories').innerHTML=Object.keys(CAT).map(k=>`<a href="#" class="chip ${k==='semua'?'active':''}" data-category="${k}">${esc(CAT[k])}</a>`).join('');
applyDark();dot();render();
if(location.hash.startsWith('#pin-'))openDetail(location.hash.slice(5));