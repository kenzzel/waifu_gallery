const cfg=window.WIBU_CONFIG||{};
const configured=!!(cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY&&!cfg.SUPABASE_URL.includes('YOUR_')&&!cfg.SUPABASE_ANON_KEY.includes('YOUR_'));
const $=id=>document.getElementById(id);
let sb=null,mode='login';
function setMode(next){
  mode=next;
  const register=mode==='register';
  $('authTitle').textContent=register?'Buat akun Waifu Gallery':'Masuk ke Waifu Gallery';
  $('nameWrap').classList.toggle('hidden',!register);
  $('displayName').required=register;
  $('authSubmit').textContent=register?'Daftar':'Masuk';
  $('switchText').textContent=register?'Sudah punya akun?':'Belum punya akun?';
  $('switchAuth').textContent=register?'Masuk':'Daftar';
  $('authMessage').textContent=register?'Buat akun untuk mengunggah, menyukai, dan menyimpan karya.':'Masuk untuk menyukai, menyimpan, dan mengunggah foto.';
}
function goApp(){
  try{localStorage.removeItem('wibu_guest_mode')}catch(e){}
  location.replace('index.html');
}
async function initLogin(){
  $('authForm').addEventListener('submit',async e=>{
    e.preventDefault();
    if(!sb)return;
    $('authSubmit').disabled=true;
    $('authMessage').textContent='Memproses...';
    const email=$('email').value.trim(),password=$('password').value;
    let result;
    if(mode==='register'){
      result=await sb.auth.signUp({email,password,options:{data:{display_name:$('displayName').value.trim()}}});
      if(!result.error&&!result.data.session){
        $('authMessage').textContent='Akun berhasil dibuat. Verifikasi email jika diminta, lalu masuk.';
        $('authSubmit').disabled=false;
        return;
      }
    }else{
      result=await sb.auth.signInWithPassword({email,password});
    }
    $('authSubmit').disabled=false;
    if(result.error){$('authMessage').textContent=result.error.message;return;}
    goApp();
  });
  $('switchAuth').addEventListener('click',()=>setMode(mode==='login'?'register':'login'));
  $('browseBtn').addEventListener('click',()=>{
    try{localStorage.setItem('wibu_guest_mode','1')}catch(e){}
    location.replace('index.html');
  });
  if(!configured){
    $('authMessage').textContent='Konfigurasi belum terbaca. Pastikan config.js berada satu folder dengan login.html.';
    $('authSubmit').disabled=true;
    return;
  }
  if(!window.supabase?.createClient){$('authMessage').textContent='Library Supabase gagal dimuat. Periksa koneksi internet lalu muat ulang.';$('authSubmit').disabled=true;return}
  sb=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY,{
    auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storage:window.localStorage,lock:async(_name,_timeout,fn)=>await fn()}
  });
  let sessionResult;
  try{
    sessionResult=await Promise.race([
      sb.auth.getSession(),
      new Promise((_,reject)=>setTimeout(()=>reject(new Error('Pemeriksaan sesi melewati 12 detik. Muat ulang halaman.')),12000))
    ]);
  }catch(e){$('authMessage').textContent='Gagal memeriksa sesi: '+e.message;return}
  const {data,error}=sessionResult;
  if(error){$('authMessage').textContent='Gagal memeriksa sesi: '+error.message;return;}
  if(data?.session?.user){goApp();return;}
  setMode('login');
}
initLogin();
