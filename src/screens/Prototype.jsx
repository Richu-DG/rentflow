import { useState, useEffect } from "react";

const T = {
  bg:"#0A0A0F",surface:"#13131A",surfaceAlt:"#1C1C26",border:"#2A2A38",
  accent:"#00E5A0",accentDim:"#00E5A022",accentGlow:"#00E5A044",
  warn:"#FF6B35",warnDim:"#FF6B3522",info:"#4D9EFF",infoDim:"#4D9EFF22",
  tp:"#F0F0F8",ts:"#8888AA",tm:"#44445A",
  paid:"#00E5A0",pending:"#FFB800",overdue:"#FF4D6A",
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const Ic=({d,size=20,color=T.ts,fill="none",sw=1.8})=><svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
const HomeIc=({a})=><Ic d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" color={a?T.accent:T.tm}/>;
const BuildIc=({a,size=20})=><Ic size={size} d="M4 21V7l8-4 8 4v14M9 21v-6h6v6" color={a?T.accent:T.tm}/>;
const BellIc=({a,size=20,color})=><Ic size={size} d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" color={color||(a?T.accent:T.tm)}/>;
const UserIc=({a})=><Ic d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" color={a?T.accent:T.tm}/>;
const ChartIc=({a})=><Ic d="M18 20V10M12 20V4M6 20v-6" color={a?T.accent:T.tm}/>;
const ChevR=()=><Ic d="M9 18l6-6-6-6" size={16}/>;
const CheckIc=({size=14,color="#fff"})=><Ic d="M20 6L9 17l-5-5" size={size} color={color} sw={2.5}/>;
const ClockIc=({size=14})=><Ic d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2" size={size} color={T.pending}/>;
const AlertIc=({size=14})=><Ic d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" size={size} color={T.overdue}/>;
const BackIc=()=><Ic d="M19 12H5M12 19l-7-7 7-7" size={20} color={T.tp}/>;
const KeyIc=()=><Ic d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" size={16} color={T.accent}/>;
const ShareIc=()=><Ic d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" size={16} color={T.accent}/>;
const CopyIc=()=><Ic d="M8 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2M8 4h8M8 4a2 2 0 012-2h4a2 2 0 012 2" size={16} color={T.accent}/>;
const GlobeIc=()=><Ic d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" size={18} color={T.accent}/>;
const MoonIc=()=><Ic d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" size={18} color={T.accent}/>;
const LogoutIc=()=><Ic d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" size={18} color={T.overdue}/>;
const TrashIc=()=><Ic d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" size={16} color={T.overdue}/>;
const PenIc=()=><Ic d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" size={16} color={T.accent}/>;
const PlusIc=({size=18,color=T.accent})=><Ic d="M12 5v14M5 12h14" size={size} color={color} sw={2.5}/>;
const SearchIc=()=><Ic d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" size={18} color={T.tm}/>;
const DownloadIc=()=><Ic d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" size={17} color={T.accent}/>;
const TrendUpIc=()=><Ic d="M23 6l-9.5 9.5-5-5L1 18" size={16} color={T.paid}/>;
const TrendDownIc=()=><Ic d="M23 18l-9.5-9.5-5 5L1 6" size={16} color={T.overdue}/>;
const ShieldIc=()=><Ic d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" size={18} color={T.accent}/>;
const PhoneIc=()=><Ic d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" size={16} color={T.ts}/>;
const MailIc=()=><Ic d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" size={16} color={T.ts}/>;
const HomeSquareIc=()=><Ic d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" size={32} color={T.accent} sw={1.5}/>;
const SparkIc=()=><Ic d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" size={28} color={T.accent} sw={1.5}/>;
const ReportIc=()=><Ic d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" size={20} color={T.accent}/>;

// ── UI Atoms ──────────────────────────────────────────────────────────────────
const Pill=({status})=>{
  const m={paid:{bg:T.accentDim,c:T.paid,l:"Paid",I:()=><CheckIc/>},pending:{bg:"#FFB80022",c:T.pending,l:"Pending",I:ClockIc},overdue:{bg:"#FF4D6A22",c:T.overdue,l:"Overdue",I:AlertIc}};
  const s=m[status];
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,background:s.bg,color:s.c,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,letterSpacing:0.3}}><s.I/>{s.l}</span>;
};

const Card=({children,style={},onClick})=>(
  <div onClick={onClick} style={{background:T.surface,borderRadius:18,border:`1px solid ${T.border}`,padding:"16px",...style,cursor:onClick?"pointer":"default"}}>{children}</div>
);

const Btn=({children,onClick,style={},v="primary"})=>{
  const vs={primary:{bg:T.accent,c:T.bg,b:"none",sh:`0 8px 32px ${T.accentGlow}`},secondary:{bg:"transparent",c:T.accent,b:`1.5px solid ${T.accent}`,sh:"none"},danger:{bg:"#FF4D6A18",c:T.overdue,b:`1.5px solid ${T.overdue}`,sh:"none"},ghost:{bg:T.surfaceAlt,c:T.tp,b:`1px solid ${T.border}`,sh:"none"}}[v];
  return <button onClick={onClick} style={{background:vs.bg,color:vs.c,border:vs.b,borderRadius:16,padding:"15px 24px",fontSize:15,fontWeight:700,width:"100%",cursor:"pointer",letterSpacing:0.3,boxShadow:vs.sh,transition:"all 0.2s",...style}}>{children}</button>;
};

const Inp=({placeholder,type="text",value,onChange,icon,label})=>(
  <div style={{marginBottom:14}}>
    {label&&<div style={{fontSize:12,color:T.ts,marginBottom:6,fontWeight:600}}>{label}</div>}
    <div style={{position:"relative"}}>
      {icon&&<div style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)"}}>{icon}</div>}
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={{width:"100%",background:T.surfaceAlt,border:`1px solid ${T.border}`,borderRadius:14,padding:icon?"14px 16px 14px 44px":"14px 16px",color:T.tp,fontSize:15,outline:"none",boxSizing:"border-box",fontFamily:"'DM Sans',sans-serif"}}/>
    </div>
  </div>
);

const Toggle=({value,onChange})=>(
  <div onClick={()=>onChange(!value)} style={{width:48,height:28,borderRadius:14,background:value?T.accent:T.border,position:"relative",cursor:"pointer",transition:"background 0.2s",flexShrink:0}}>
    <div style={{position:"absolute",top:4,left:value?24:4,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left 0.2s",boxShadow:"0 2px 4px #00000044"}}/>
  </div>
);

const SH=({title,action,onAction})=>(
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
    <span style={{fontSize:17,fontWeight:700,color:T.tp}}>{title}</span>
    {action&&<span onClick={onAction} style={{fontSize:13,color:T.accent,fontWeight:600,cursor:"pointer"}}>{action}</span>}
  </div>
);

const BH=({title,sub,onBack,action,onAction})=>(
  <div style={{padding:"20px 24px",background:`linear-gradient(180deg,${T.accentGlow} 0%,transparent 100%)`,flexShrink:0}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div onClick={onBack} style={{width:40,height:40,background:T.surface,borderRadius:12,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><BackIc/></div>
        <div><div style={{fontSize:18,fontWeight:800,color:T.tp}}>{title}</div>{sub&&<div style={{fontSize:12,color:T.ts,marginTop:1}}>{sub}</div>}</div>
      </div>
      {action&&<span onClick={onAction} style={{fontSize:13,color:T.accent,fontWeight:600,cursor:"pointer"}}>{action}</span>}
    </div>
  </div>
);

const PBar=({step,total})=>(
  <div style={{height:3,background:T.border,flexShrink:0}}>
    <div style={{height:"100%",background:T.accent,width:`${(step/total)*100}%`,transition:"width 0.4s ease",borderRadius:2}}/>
  </div>
);

// ── Static Data ───────────────────────────────────────────────────────────────
const initBuildings=[
  {id:1,name:"Sunset Apartments",location:"Westlands, Nairobi",dueDay:1,notifyDay:5,
   units:[
    {id:1,name:"House 1",tenant:"James Mwangi",  phone:"+254 712 345 678",rent:25000,status:"paid",   ref:"MPX3928110"},
    {id:2,name:"House 2",tenant:"Grace Akinyi",  phone:"+254 723 456 789",rent:25000,status:"pending",ref:null},
    {id:3,name:"House 3",tenant:"Brian Otieno",  phone:"+254 734 567 890",rent:30000,status:"overdue",ref:null},
    {id:4,name:"House 4",tenant:"Fatuma Hassan", phone:"+254 745 678 901",rent:25000,status:"paid",   ref:"MPX3928445"},
    {id:5,name:"House 5",tenant:"David Kamau",   phone:"+254 756 789 012",rent:28000,status:"pending",ref:null},
    {id:6,name:"House 6",tenant:"Mercy Wanjiku", phone:"+254 767 890 123",rent:25000,status:"paid",   ref:"MPX3928667"},
  ]},
  {id:2,name:"Kilimani Heights",location:"Kilimani, Nairobi",dueDay:1,notifyDay:5,
   units:[
    {id:7,name:"Unit A",tenant:"Peter Njoroge",phone:"+254 778 901 234",rent:45000,status:"paid",   ref:"MPX3929001"},
    {id:8,name:"Unit B",tenant:"Sarah Chebet", phone:"+254 789 012 345",rent:45000,status:"overdue",ref:null},
    {id:9,name:"Unit C",tenant:"Tom Odhiambo", phone:"+254 790 123 456",rent:50000,status:"pending",ref:null},
  ]},
];

const monthlyHistory=[
  {month:"May 2025",paid:6,total:9,collected:190000,expected:253000},
  {month:"Apr 2025",paid:9,total:9,collected:253000,expected:253000},
  {month:"Mar 2025",paid:8,total:9,collected:228000,expected:253000},
  {month:"Feb 2025",paid:7,total:9,collected:202000,expected:253000},
  {month:"Jan 2025",paid:9,total:9,collected:253000,expected:253000},
  {month:"Dec 2024",paid:8,total:9,collected:228000,expected:253000},
];

const notifData=[
  {id:1,type:"overdue",title:"Day 5 Reminder",  body:"2 units overdue: House 3, Unit B",         time:"Today, 9:00 AM",unread:true},
  {id:2,type:"pending",title:"Pending Payments", body:"3 units pending across 2 buildings",      time:"Today, 9:00 AM",unread:true},
  {id:3,type:"paid",   title:"Payment Confirmed",body:"Mercy Wanjiku – House 6 confirmed",       time:"May 1, 3:14 PM",unread:false},
  {id:4,type:"paid",   title:"Payment Confirmed",body:"James Mwangi – House 1 confirmed",        time:"May 1, 11:22 AM",unread:false},
];

const languages=[
  {code:"en",label:"English",   native:"English",   flag:"🇬🇧"},
  {code:"sw",label:"Swahili",   native:"Kiswahili", flag:"🇰🇪"},
  {code:"fr",label:"French",    native:"Français",  flag:"🇫🇷"},
  {code:"ar",label:"Arabic",    native:"العربية",  flag:"🇸🇦"},
  {code:"es",label:"Spanish",   native:"Español",   flag:"🇪🇸"},
  {code:"pt",label:"Portuguese",native:"Português", flag:"🇧🇷"},
  {code:"hi",label:"Hindi",     native:"हिन्दी",   flag:"🇮🇳"},
  {code:"zh",label:"Chinese",   native:"中文",      flag:"🇨🇳"},
];

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: Onboarding
// ═══════════════════════════════════════════════════════════════════════════════
const OnboardingScreen=({onNext})=>{
  const [s,setS]=useState(0);
  const slides=[
    {e:"🏢",t:"Manage Your Properties",d:"Add buildings, set up units and invite tenants in minutes."},
    {e:"✅",t:"Track Every Payment",    d:"Tenants self-report payments. You confirm. Simple."},
    {e:"🔔",t:"Smart Notifications",    d:"Custom alerts on your chosen day — see who has and hasn't paid."},
  ];
  const sl=slides[s];
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",padding:"60px 32px 48px",background:`radial-gradient(ellipse at 50% 0%,${T.accentGlow} 0%,${T.bg} 60%)`}}>
      <div style={{width:90,height:90,background:T.accentDim,borderRadius:28,display:"flex",alignItems:"center",justifyContent:"center",fontSize:42,border:`1px solid ${T.accent}44`,boxShadow:`0 0 60px ${T.accentGlow}`}}>{sl.e}</div>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:30,fontWeight:800,color:T.tp,lineHeight:1.2,marginBottom:16,letterSpacing:-0.5}}>{sl.t}</div>
        <div style={{fontSize:16,color:T.ts,lineHeight:1.6}}>{sl.d}</div>
      </div>
      <div style={{width:"100%"}}>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:32}}>
          {slides.map((_,i)=><div key={i} onClick={()=>setS(i)} style={{width:i===s?24:8,height:8,borderRadius:4,background:i===s?T.accent:T.border,transition:"all 0.3s",cursor:"pointer"}}/>)}
        </div>
        {s<2?<Btn onClick={()=>setS(s+1)}>Next →</Btn>:<Btn onClick={onNext}>Get Started</Btn>}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: Auth
// ═══════════════════════════════════════════════════════════════════════════════
const AuthScreen=({onLogin})=>{
  const [mode,setMode]=useState("login");
  const [authType,setAuthType]=useState("phone");
  const [role,setRole]=useState(null);
  const [step,setStep]=useState(1);

  if(step===2) return (
    <div style={{flex:1,display:"flex",flexDirection:"column",padding:"40px 24px",background:`radial-gradient(ellipse at 50% -20%,${T.accentGlow} 0%,${T.bg} 50%)`}}>
      <div style={{marginBottom:32}}><div style={{fontSize:26,fontWeight:800,color:T.tp,marginBottom:8}}>I am a...</div><div style={{fontSize:15,color:T.ts}}>Select your role to continue</div></div>
      {[{id:"landlord",l:"Landlord / Manager",s:"Manage buildings, units & track payments",e:"🏢"},{id:"tenant",l:"Tenant / Renter",s:"View your unit, mark payments & more",e:"🏠"}].map(r=>(
        <Card key={r.id} onClick={()=>setRole(r.id)} style={{marginBottom:16,border:role===r.id?`1.5px solid ${T.accent}`:`1px solid ${T.border}`,background:role===r.id?T.accentDim:T.surface}}>
          <div style={{display:"flex",alignItems:"center",gap:16}}><div style={{fontSize:32}}>{r.e}</div><div><div style={{fontSize:16,fontWeight:700,color:T.tp}}>{r.l}</div><div style={{fontSize:13,color:T.ts,marginTop:2}}>{r.s}</div></div></div>
        </Card>
      ))}
      <div style={{flex:1}}/>
      <Btn onClick={()=>role&&onLogin(role)} style={{opacity:role?1:0.4}}>Continue as {role?(role==="landlord"?"Landlord":"Tenant"):"..."}</Btn>
    </div>
  );

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",padding:"40px 24px 32px",background:`radial-gradient(ellipse at 50% -20%,${T.accentGlow} 0%,${T.bg} 50%)`}}>
      <div style={{marginBottom:32}}><div style={{fontSize:28,fontWeight:800,color:T.tp,letterSpacing:-0.5}}>{mode==="login"?"Welcome back":"Create account"}</div><div style={{fontSize:15,color:T.ts,marginTop:6}}>RentFlow — smarter rent tracking</div></div>
      <div style={{display:"flex",background:T.surfaceAlt,borderRadius:14,padding:4,marginBottom:24}}>
        {["phone","email"].map(t=><div key={t} onClick={()=>setAuthType(t)} style={{flex:1,textAlign:"center",padding:"10px",borderRadius:10,background:authType===t?T.surface:"transparent",color:authType===t?T.tp:T.ts,fontWeight:600,fontSize:14,cursor:"pointer",transition:"all 0.2s"}}>{t==="phone"?"📱 Phone":"✉️ Email"}</div>)}
      </div>
      {authType==="phone"?<><Inp placeholder="Phone number (+254...)" type="tel"/><Inp placeholder="OTP Code" type="number"/></>:<><Inp placeholder="Email address" type="email"/><Inp placeholder="Password" type="password"/></>}
      <Btn onClick={()=>setStep(2)} style={{marginTop:8}}>{mode==="login"?"Sign In":"Create Account"}</Btn>
      <div style={{textAlign:"center",marginTop:20,fontSize:14,color:T.ts}}>{mode==="login"?"No account? ":"Have an account? "}<span onClick={()=>setMode(mode==="login"?"signup":"login")} style={{color:T.accent,fontWeight:600,cursor:"pointer"}}>{mode==="login"?"Sign up":"Sign in"}</span></div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: First-time Landlord Onboarding (NEW)
// ═══════════════════════════════════════════════════════════════════════════════
const FirstTimeOnboarding=({onDone})=>{
  const [step,setStep]=useState(0);
  const steps=[
    {icon:"👋",title:"Welcome to RentFlow!",body:"You're all set up. Let's get your first building ready in just 3 quick steps.",cta:"Let's Go",bg:T.accentGlow},
    {icon:"🏢",title:"Add Your First Building",body:"Create a building, give it a name and tell us how many units it has.",cta:"Got it",bg:"#4D9EFF22"},
    {icon:"📨",title:"Invite Your Tenants",body:"Each unit gets a unique code or link. Share it with your tenant via WhatsApp or SMS.",cta:"Got it",bg:"#FF6B3522"},
    {icon:"🔔",title:"Set Your Notifications",body:"Pick the day you want to be reminded about unpaid rent. RentFlow does the rest.",cta:"Start Now →",bg:T.accentGlow},
  ];
  const st=steps[step];
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"48px 28px 40px",background:`radial-gradient(ellipse at 50% 0%,${st.bg} 0%,${T.bg} 70%)`}}>
      {/* Step dots */}
      <div style={{display:"flex",gap:8,marginBottom:48}}>
        {steps.map((_,i)=><div key={i} style={{width:i===step?24:8,height:8,borderRadius:4,background:i===step?T.accent:i<step?T.accent+"66":T.border,transition:"all 0.3s"}}/>)}
      </div>

      {/* Icon */}
      <div style={{width:100,height:100,borderRadius:32,background:T.accentDim,border:`1px solid ${T.accent}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,boxShadow:`0 0 60px ${T.accentGlow}`,marginBottom:32}}>{st.icon}</div>

      {/* Text */}
      <div style={{textAlign:"center",marginBottom:"auto"}}>
        <div style={{fontSize:26,fontWeight:800,color:T.tp,lineHeight:1.3,marginBottom:14,letterSpacing:-0.5}}>{st.title}</div>
        <div style={{fontSize:16,color:T.ts,lineHeight:1.7}}>{st.body}</div>
      </div>

      {/* Mini checklist on last step */}
      {step===3&&(
        <div style={{width:"100%",marginBottom:24,marginTop:20}}>
          {[{done:true,l:"Account created ✓"},{done:true,l:"Role selected ✓"},{done:false,l:"First building — let's go!"},{done:false,l:"Notify on day 5 of month"}].map((item,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:item.done?T.accentDim:T.surfaceAlt,borderRadius:12,marginBottom:8,border:`1px solid ${item.done?T.accent+"33":T.border}`}}>
              <div style={{width:22,height:22,borderRadius:7,background:item.done?T.accent:T.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {item.done&&<CheckIc size={12}/>}
              </div>
              <div style={{fontSize:13,fontWeight:600,color:item.done?T.accent:T.ts}}>{item.l}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{width:"100%",marginTop:32}}>
        <Btn onClick={()=>step<steps.length-1?setStep(step+1):onDone()}>{st.cta}</Btn>
        {step>0&&<Btn v="ghost" style={{marginTop:10}} onClick={()=>setStep(step-1)}>Back</Btn>}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: Empty State Dashboard (NEW)
// ═══════════════════════════════════════════════════════════════════════════════
const EmptyDashboard=({onAdd,onNavigate})=>(
  <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"24px 24px 40px"}}>
    {/* Header */}
    <div style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:40}}>
      <div><div style={{fontSize:13,color:T.ts,marginBottom:4}}>Good morning 👋</div><div style={{fontSize:22,fontWeight:800,color:T.tp}}>John Kariuki</div></div>
      <div onClick={()=>onNavigate("notifications")} style={{width:44,height:44,background:T.surface,borderRadius:14,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><BellIc/></div>
    </div>

    {/* Empty illustration */}
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",gap:20}}>
      <div style={{width:120,height:120,borderRadius:36,background:`linear-gradient(135deg,${T.accentDim},${T.surfaceAlt})`,border:`1px solid ${T.accent}33`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 60px ${T.accentGlow}`}}>
        <HomeSquareIc/>
      </div>
      <div>
        <div style={{fontSize:22,fontWeight:800,color:T.tp,marginBottom:8}}>No buildings yet</div>
        <div style={{fontSize:15,color:T.ts,lineHeight:1.7,maxWidth:280}}>Add your first building to start tracking rent payments from your tenants.</div>
      </div>
      <Btn onClick={onAdd} style={{marginTop:8}}>🏢 Add Your First Building</Btn>

      {/* Feature hints */}
      <div style={{width:"100%",marginTop:12}}>
        {[{e:"📨",t:"Invite tenants via link or code",c:T.accent},{e:"✅",t:"Tenants self-report — you confirm",c:T.paid},{e:"🔔",t:"Custom notifications on your day",c:T.info}].map((f,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,marginBottom:8}}>
            <div style={{fontSize:20}}>{f.e}</div>
            <div style={{fontSize:13,fontWeight:600,color:T.ts}}>{f.t}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: Dashboard
// ═══════════════════════════════════════════════════════════════════════════════
const Dashboard=({onNavigate,buildings})=>{
  const all=buildings.flatMap(b=>b.units);
  const paid=all.filter(u=>u.status==="paid").length, pending=all.filter(u=>u.status==="pending").length, overdue=all.filter(u=>u.status==="overdue").length, total=all.length;
  const pct=total>0?Math.round((paid/total)*100):0;
  const totalExpected=all.reduce((s,u)=>s+u.rent,0);
  const totalCollected=all.filter(u=>u.status==="paid").reduce((s,u)=>s+u.rent,0);

  if(buildings.length===0) return <EmptyDashboard onAdd={()=>onNavigate("addBuilding")} onNavigate={onNavigate}/>;

  return (
    <div style={{paddingBottom:24}}>
      <div style={{padding:"20px 24px 0",background:`linear-gradient(180deg,${T.accentGlow} 0%,transparent 100%)`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
          <div><div style={{fontSize:13,color:T.ts,marginBottom:4}}>Good morning 👋</div><div style={{fontSize:22,fontWeight:800,color:T.tp,letterSpacing:-0.3}}>John Kariuki</div></div>
          <div style={{display:"flex",gap:8}}>
            <div onClick={()=>onNavigate("reports")} style={{width:44,height:44,background:T.surface,borderRadius:14,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><ReportIc/></div>
            <div onClick={()=>onNavigate("notifications")} style={{position:"relative",width:44,height:44,background:T.surface,borderRadius:14,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
              <BellIc/><div style={{position:"absolute",top:8,right:8,width:8,height:8,background:T.overdue,borderRadius:"50%",border:`2px solid ${T.bg}`}}/>
            </div>
          </div>
        </div>

        {/* Collection ring card */}
        <Card style={{marginBottom:20,background:`linear-gradient(135deg,${T.surface},${T.surfaceAlt})`,padding:"20px"}}>
          <div style={{display:"flex",alignItems:"center",gap:20}}>
            <div style={{position:"relative",width:80,height:80,flexShrink:0}}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke={T.border} strokeWidth="8"/>
                <circle cx="40" cy="40" r="32" fill="none" stroke={T.accent} strokeWidth="8" strokeDasharray={`${2*Math.PI*32}`} strokeDashoffset={`${2*Math.PI*32*(1-pct/100)}`} strokeLinecap="round" transform="rotate(-90 40 40)"/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:18,fontWeight:800,color:T.accent}}>{pct}%</span></div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:18,fontWeight:700,color:T.tp,marginBottom:2}}>May Collection</div>
              <div style={{fontSize:13,color:T.ts,marginBottom:6}}>KES {totalCollected.toLocaleString()} / {totalExpected.toLocaleString()}</div>
              <div style={{display:"flex",gap:8}}>
                {[[paid,T.paid,T.accentDim,"Paid"],[pending,T.pending,"#FFB80018","Pend."],[overdue,T.overdue,"#FF4D6A18","Late"]].map(([v,c,bg,l])=>(
                  <div key={l} style={{flex:1,background:bg,borderRadius:10,padding:"6px 10px",textAlign:"center"}}>
                    <div style={{fontSize:16,fontWeight:700,color:c}}>{v}</div>
                    <div style={{fontSize:10,color:T.tm}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div style={{padding:"0 24px"}}>
        <SH title="My Buildings" action="+ Add" onAction={()=>onNavigate("addBuilding")}/>
        {buildings.map(b=>{
          const bp=b.units.filter(u=>u.status==="paid").length, bo=b.units.filter(u=>u.status==="overdue").length;
          return (
            <Card key={b.id} onClick={()=>onNavigate("building",b)} style={{marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
                <div style={{width:44,height:44,background:T.accentDim,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center"}}><BuildIc a size={22}/></div>
                <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:T.tp}}>{b.name}</div><div style={{fontSize:12,color:T.ts}}>{b.location}</div></div>
                <ChevR/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:13,color:T.ts}}>{b.units.length} units · {bp} paid</div>
                <div style={{display:"flex",gap:6}}>
                  {bo>0&&<span style={{background:"#FF4D6A22",color:T.overdue,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>⚠ {bo} late</span>}
                  <span style={{background:T.accentDim,color:T.accent,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>{Math.round(bp/b.units.length*100)}%</span>
                </div>
              </div>
            </Card>
          );
        })}

        <SH title="Recent Activity"/>
        {[{n:"Grace Akinyi",u:"House 2",a:"Marked as paid",t:"2 min ago"},{n:"James Mwangi",u:"House 1",a:"Payment confirmed",t:"1h ago"},{n:"Brian Otieno",u:"House 3",a:"Overdue — Day 5",t:"Today, 9:00 AM"}].map((a,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:i<2?`1px solid ${T.border}`:"none"}}>
            <div style={{width:40,height:40,borderRadius:12,background:T.surfaceAlt,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:T.accent}}>{a.n[0]}</div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:T.tp}}>{a.n}</div><div style={{fontSize:12,color:T.ts}}>{a.u} · {a.a}</div></div>
            <div style={{fontSize:11,color:T.tm}}>{a.t}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: Reports (NEW)
// ═══════════════════════════════════════════════════════════════════════════════
const ReportsScreen=({onBack,buildings})=>{
  const [selMonth,setSelMonth]=useState(0);
  const [tab,setTab]=useState("overview");
  const all=buildings.flatMap(b=>b.units);
  const totalExpected=all.reduce((s,u)=>s+u.rent,0);

  // Mini bar chart
  const maxVal=Math.max(...monthlyHistory.map(m=>m.collected));
  const BarChart=()=>(
    <div style={{marginTop:8}}>
      <div style={{display:"flex",alignItems:"flex-end",gap:6,height:80}}>
        {monthlyHistory.map((m,i)=>{
          const h=Math.round((m.collected/maxVal)*72);
          const isSelected=i===selMonth;
          return (
            <div key={i} onClick={()=>setSelMonth(i)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer"}}>
              <div style={{width:"100%",height:h,background:isSelected?T.accent:T.accentDim,borderRadius:"6px 6px 0 0",border:isSelected?`1px solid ${T.accent}`:0,transition:"all 0.2s"}}/>
              <div style={{fontSize:9,color:isSelected?T.accent:T.tm,fontWeight:isSelected?700:400,textAlign:"center"}}>{m.month.split(" ")[0].slice(0,3)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const selected=monthlyHistory[selMonth];
  const collectionRate=Math.round((selected.paid/selected.total)*100);

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <BH title="Reports" sub="Financial overview" onBack={onBack} action={<span style={{display:"flex",alignItems:"center",gap:4}}><DownloadIc/>Export</span>} onAction={()=>{}}/>
      <div style={{flex:1,overflowY:"auto",scrollbarWidth:"none",padding:"16px 24px 40px"}}>

        {/* Tabs */}
        <div style={{display:"flex",background:T.surfaceAlt,borderRadius:14,padding:4,marginBottom:20}}>
          {["overview","buildings","units"].map(t=>(
            <div key={t} onClick={()=>setTab(t)} style={{flex:1,textAlign:"center",padding:"10px",borderRadius:10,background:tab===t?T.surface:"transparent",color:tab===t?T.tp:T.ts,fontWeight:600,fontSize:13,cursor:"pointer",transition:"all 0.2s",textTransform:"capitalize"}}>{t}</div>
          ))}
        </div>

        {tab==="overview"&&<>
          {/* Summary cards */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
            {[
              {l:"Total Expected",v:`KES ${totalExpected.toLocaleString()}`,sub:"Per month",c:T.tp,bg:T.surfaceAlt},
              {l:"Collected (May)",v:`KES ${selected.collected.toLocaleString()}`,sub:`${collectionRate}% rate`,c:T.paid,bg:T.accentDim},
              {l:"Outstanding",    v:`KES ${(selected.expected-selected.collected).toLocaleString()}`,sub:`${selected.total-selected.paid} units`,c:T.overdue,bg:"#FF4D6A18"},
              {l:"On-time Rate",   v:`${collectionRate}%`,sub:"This month",c:T.info,bg:T.infoDim},
            ].map((s,i)=>(
              <div key={i} style={{background:s.bg,border:`1px solid ${T.border}`,borderRadius:16,padding:"14px"}}>
                <div style={{fontSize:11,color:T.tm,marginBottom:4}}>{s.l}</div>
                <div style={{fontSize:17,fontWeight:800,color:s.c,letterSpacing:-0.3}}>{s.v}</div>
                <div style={{fontSize:11,color:T.ts,marginTop:2}}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <Card style={{marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
              <div><div style={{fontSize:15,fontWeight:700,color:T.tp}}>Collection History</div><div style={{fontSize:12,color:T.ts}}>Last 6 months</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:700,color:T.accent}}>{selected.month}</div><div style={{fontSize:11,color:T.ts}}>KES {selected.collected.toLocaleString()}</div></div>
            </div>
            <BarChart/>
          </Card>

          {/* Selected month detail */}
          <Card style={{marginBottom:20,border:`1px solid ${T.accent}33`,background:T.accentDim}}>
            <div style={{fontSize:14,fontWeight:700,color:T.accent,marginBottom:12}}>{selected.month} — Breakdown</div>
            {[["Units Paid",`${selected.paid} / ${selected.total}`],["Collection Rate",`${collectionRate}%`],["Amount Collected",`KES ${selected.collected.toLocaleString()}`],["Outstanding",`KES ${(selected.expected-selected.collected).toLocaleString()}`]].map(([l,v],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<3?`1px solid ${T.accent}22`:"none"}}>
                <div style={{fontSize:13,color:T.ts}}>{l}</div>
                <div style={{fontSize:14,fontWeight:700,color:T.tp}}>{v}</div>
              </div>
            ))}
          </Card>

          {/* Trend */}
          <Card>
            <div style={{fontSize:15,fontWeight:700,color:T.tp,marginBottom:14}}>Month-on-Month Trend</div>
            {monthlyHistory.slice(0,4).map((m,i)=>{
              const prev=monthlyHistory[i+1];
              const up=prev?m.collected>=prev.collected:true;
              return (
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<3?`1px solid ${T.border}`:"none"}}>
                  <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:T.tp}}>{m.month}</div><div style={{fontSize:12,color:T.ts}}>{m.paid}/{m.total} paid</div></div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:14,fontWeight:700,color:T.tp}}>KES {m.collected.toLocaleString()}</div>
                    <div style={{display:"flex",alignItems:"center",gap:4,justifyContent:"flex-end",marginTop:2}}>
                      {up?<TrendUpIc/>:<TrendDownIc/>}
                      <span style={{fontSize:11,color:up?T.paid:T.overdue,fontWeight:600}}>{up?"On track":"Below target"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </Card>
        </>}

        {tab==="buildings"&&<>
          {buildings.map(b=>{
            const bp=b.units.filter(u=>u.status==="paid"), br=Math.round(bp.length/b.units.length*100);
            const bc=bp.reduce((s,u)=>s+u.rent,0), be=b.units.reduce((s,u)=>s+u.rent,0);
            return (
              <Card key={b.id} style={{marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                  <div style={{width:44,height:44,background:T.accentDim,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center"}}><BuildIc a size={22}/></div>
                  <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:T.tp}}>{b.name}</div><div style={{fontSize:12,color:T.ts}}>{b.units.length} units</div></div>
                  <span style={{background:br>=80?T.accentDim:br>=50?"#FFB80022":"#FF4D6A22",color:br>=80?T.paid:br>=50?T.pending:T.overdue,borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:700}}>{br}%</span>
                </div>
                {/* Mini progress */}
                <div style={{height:6,background:T.border,borderRadius:3,marginBottom:12}}>
                  <div style={{height:"100%",background:T.accent,width:`${br}%`,borderRadius:3,transition:"width 0.5s"}}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  {[["Collected",`KES ${bc.toLocaleString()}`,T.paid],["Expected",`KES ${be.toLocaleString()}`,T.ts],["Gap",`KES ${(be-bc).toLocaleString()}`,T.overdue]].map(([l,v,c])=>(
                    <div key={l} style={{background:T.surfaceAlt,borderRadius:10,padding:"8px"}}>
                      <div style={{fontSize:10,color:T.tm,marginBottom:2}}>{l}</div>
                      <div style={{fontSize:12,fontWeight:700,color:c}}>{v}</div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </>}

        {tab==="units"&&<>
          <div style={{marginBottom:12}}>
            {buildings.flatMap(b=>b.units.map(u=>({...u,building:b.name}))).map((u,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${T.border}`}}>
                <div style={{width:38,height:38,borderRadius:11,background:u.status==="paid"?T.accentDim:u.status==="overdue"?"#FF4D6A22":"#FFB80022",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:u.status==="paid"?T.paid:u.status==="overdue"?T.overdue:T.pending,flexShrink:0}}>
                  {u.name.charAt(u.name.length-1)}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:600,color:T.tp}}>{u.name}</div>
                  <div style={{fontSize:11,color:T.ts,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.building}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:13,fontWeight:700,color:T.tp,marginBottom:3}}>KES {u.rent.toLocaleString()}</div>
                  <Pill status={u.status}/>
                </div>
              </div>
            ))}
          </div>
        </>}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: Building Detail
// ═══════════════════════════════════════════════════════════════════════════════
const BuildingDetail=({building,onBack,onNavigate})=>{
  const [filter,setFilter]=useState("all");
  const filtered=filter==="all"?building.units:building.units.filter(u=>u.status===filter);
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"20px 24px",background:`linear-gradient(180deg,${T.accentGlow} 0%,transparent 100%)`,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div onClick={onBack} style={{width:40,height:40,background:T.surface,borderRadius:12,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><BackIc/></div>
            <div><div style={{fontSize:18,fontWeight:800,color:T.tp}}>{building.name}</div><div style={{fontSize:12,color:T.ts}}>{building.location}</div></div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <div onClick={()=>onNavigate("notifSettings",building)} style={{width:36,height:36,background:T.surface,borderRadius:10,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><BellIc size={18}/></div>
            <div onClick={()=>onNavigate("addUnit",building)} style={{width:36,height:36,background:T.accentDim,borderRadius:10,border:`1px solid ${T.accent}44`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><PlusIc/></div>
          </div>
        </div>
        <div style={{position:"relative",marginBottom:12}}>
          <div style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)"}}><SearchIc/></div>
          <input placeholder="Search units or tenants..." style={{width:"100%",background:T.surfaceAlt,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 16px 14px 44px",color:T.tp,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"'DM Sans',sans-serif"}}/>
        </div>
        <div style={{display:"flex",gap:8,overflowX:"auto",scrollbarWidth:"none"}}>
          {["all","paid","pending","overdue"].map(f=>(
            <div key={f} onClick={()=>setFilter(f)} style={{flexShrink:0,padding:"7px 16px",borderRadius:20,fontSize:13,fontWeight:600,cursor:"pointer",background:filter===f?T.accent:T.surfaceAlt,color:filter===f?T.bg:T.ts,transition:"all 0.2s"}}>
              {f.charAt(0).toUpperCase()+f.slice(1)} ({f==="all"?building.units.length:building.units.filter(u=>u.status===f).length})
            </div>
          ))}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"8px 24px 24px",scrollbarWidth:"none"}}>
        {filtered.length===0?(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 20px",textAlign:"center",gap:16}}>
            <div style={{fontSize:40}}>🏠</div>
            <div style={{fontSize:16,fontWeight:700,color:T.tp}}>No {filter} units</div>
            <div style={{fontSize:13,color:T.ts}}>No units match this filter right now.</div>
          </div>
        ):filtered.map(unit=>(
          <Card key={unit.id} onClick={()=>onNavigate("unit",unit)} style={{marginBottom:12,display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:46,height:46,borderRadius:14,background:unit.status==="paid"?T.accentDim:unit.status==="overdue"?"#FF4D6A22":"#FFB80022",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:unit.status==="paid"?T.paid:unit.status==="overdue"?T.overdue:T.pending,flexShrink:0}}>
              {unit.name.charAt(unit.name.length-1)}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:15,fontWeight:700,color:T.tp}}>{unit.name}</div>
              <div style={{fontSize:12,color:T.ts,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{unit.tenant}</div>
              <div style={{fontSize:13,color:T.tp,fontWeight:600,marginTop:2}}>KES {unit.rent.toLocaleString()}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
              <Pill status={unit.status}/>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span onClick={e=>{e.stopPropagation();onNavigate("invite",unit);}} style={{fontSize:11,color:T.accent,fontWeight:700,cursor:"pointer"}}>Invite</span>
                <ChevR/>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: Unit Detail
// ═══════════════════════════════════════════════════════════════════════════════
const UnitDetail=({unit,onBack,onNavigate})=>{
  const [confirmed,setConfirmed]=useState(unit.status==="paid");
  const [rejected,setRejected]=useState(false);
  const cs=confirmed?"paid":rejected?"overdue":unit.status;
  return (
    <div style={{flex:1,overflowY:"auto",scrollbarWidth:"none"}}>
      <BH title="Unit Detail" onBack={onBack} action="Invite →" onAction={()=>onNavigate("invite",unit)}/>
      <div style={{padding:"0 24px 32px"}}>
        <Card style={{marginBottom:16,background:`linear-gradient(135deg,${T.surfaceAlt},${T.surface})`}}>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
            <div style={{width:54,height:54,borderRadius:16,background:T.accentDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:800,color:T.accent}}>{unit.tenant[0]}</div>
            <div><div style={{fontSize:17,fontWeight:700,color:T.tp}}>{unit.tenant}</div><div style={{fontSize:13,color:T.ts}}>{unit.phone}</div></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["Unit",unit.name],["Rent (KES)",unit.rent.toLocaleString()],["Due Date","1st of month"],["Status",""]].map(([l,v],i)=>(
              <div key={i} style={{background:T.bg,borderRadius:12,padding:"10px 14px"}}>
                <div style={{fontSize:11,color:T.tm,marginBottom:4}}>{l}</div>
                {l==="Status"?<Pill status={cs}/>:<div style={{fontSize:14,fontWeight:700,color:T.tp}}>{v}</div>}
              </div>
            ))}
          </div>
        </Card>
        {unit.status==="pending"&&!confirmed&&!rejected&&(
          <Card style={{marginBottom:16,border:`1px solid ${T.pending}44`,background:"#FFB80011"}}>
            <div style={{display:"flex",gap:10,marginBottom:12}}><ClockIc/><div style={{fontSize:14,fontWeight:700,color:T.pending}}>Tenant marked as paid</div></div>
            {unit.ref&&<div style={{fontSize:13,color:T.ts,marginBottom:16}}>Ref: <span style={{color:T.tp,fontWeight:600}}>{unit.ref}</span></div>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <button onClick={()=>setConfirmed(true)} style={{background:T.accentDim,border:`1px solid ${T.accent}`,borderRadius:12,padding:"12px",color:T.accent,fontWeight:700,fontSize:14,cursor:"pointer"}}>✓ Confirm</button>
              <button onClick={()=>setRejected(true)} style={{background:"#FF4D6A18",border:`1px solid ${T.overdue}`,borderRadius:12,padding:"12px",color:T.overdue,fontWeight:700,fontSize:14,cursor:"pointer"}}>✗ Reject</button>
            </div>
          </Card>
        )}
        {confirmed&&<Card style={{marginBottom:16,border:`1px solid ${T.accent}44`,background:T.accentDim}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:32,height:32,background:T.accent,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center"}}><CheckIc size={16}/></div><div><div style={{fontSize:14,fontWeight:700,color:T.accent}}>Payment Confirmed</div><div style={{fontSize:12,color:T.ts}}>Confirmed for May 2025</div></div></div></Card>}
        <SH title="Payment History"/>
        {[{m:"May 2025",s:cs,r:unit.ref||"—",a:unit.rent},{m:"Apr 2025",s:"paid",r:"MPX3801234",a:unit.rent},{m:"Mar 2025",s:"paid",r:"MPX3712098",a:unit.rent},{m:"Feb 2025",s:"overdue",r:"—",a:unit.rent}].map((p,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",padding:"14px 0",borderBottom:i<3?`1px solid ${T.border}`:"none"}}>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:T.tp}}>{p.m}</div><div style={{fontSize:12,color:T.ts}}>Ref: {p.r}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:700,color:T.tp,marginBottom:4}}>KES {p.a.toLocaleString()}</div><Pill status={p.s}/></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: Add Building
// ═══════════════════════════════════════════════════════════════════════════════
const AddBuilding=({onBack,onSave})=>{
  const [step,setStep]=useState(1);
  const [name,setName]=useState(""); const [location,setLocation]=useState(""); const [rentAmount,setRentAmount]=useState("");
  const [unitCount,setUnitCount]=useState(""); const [unitNames,setUnitNames]=useState([]);
  const [dueDay,setDueDay]=useState("1"); const [notifyDay,setNotifyDay]=useState("5");
  const confirmCount=()=>{const c=parseInt(unitCount);if(c>0&&c<=50){setUnitNames(Array.from({length:c},(_,i)=>`House ${i+1}`));setStep(3);}};
  const ord=d=>`${d}${d===1?"st":d===2?"nd":d===3?"rd":"th"}`;
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <BH title="Add Building" sub={`Step ${step} of 4`} onBack={step===1?onBack:()=>setStep(step-1)}/>
      <PBar step={step} total={4}/>
      <div style={{flex:1,overflowY:"auto",scrollbarWidth:"none",padding:"24px 24px 40px"}}>
        {step===1&&<><div style={{fontSize:22,fontWeight:800,color:T.tp,marginBottom:6}}>Building Details</div><div style={{fontSize:14,color:T.ts,marginBottom:28}}>Name your building and set a default rent</div><Inp label="Building Name" placeholder="e.g. Sunset Apartments" value={name} onChange={e=>setName(e.target.value)}/><Inp label="Location" placeholder="e.g. Westlands, Nairobi" value={location} onChange={e=>setLocation(e.target.value)}/><Inp label="Default Monthly Rent (KES)" placeholder="e.g. 25000" type="number" value={rentAmount} onChange={e=>setRentAmount(e.target.value)}/><Btn onClick={()=>name&&setStep(2)} style={{marginTop:8,opacity:name?1:0.4}}>Continue →</Btn></>}
        {step===2&&<><div style={{fontSize:22,fontWeight:800,color:T.tp,marginBottom:6}}>Set Up Units</div><div style={{fontSize:14,color:T.ts,marginBottom:28}}>How many units does <span style={{color:T.accent}}>{name}</span> have?</div><Inp label="Number of Units" placeholder="e.g. 12 (max 50)" type="number" value={unitCount} onChange={e=>setUnitCount(e.target.value)}/><Card style={{marginBottom:24,border:`1px solid ${T.accent}22`}}><div style={{fontSize:13,color:T.ts,lineHeight:1.7}}>💡 Units auto-named <span style={{color:T.accent}}>House 1, House 2...</span> — rename in next step.</div></Card><Btn onClick={confirmCount} style={{opacity:parseInt(unitCount)>0?1:0.4}}>Continue →</Btn></>}
        {step===3&&<><div style={{fontSize:22,fontWeight:800,color:T.tp,marginBottom:6}}>Name Your Units</div><div style={{fontSize:14,color:T.ts,marginBottom:20}}>Customise or keep the defaults</div>{unitNames.map((n,i)=><Inp key={i} label={`Unit ${i+1}`} placeholder={`Unit ${i+1} name`} value={n} onChange={e=>{const c=[...unitNames];c[i]=e.target.value;setUnitNames(c);}}/>)}<Btn onClick={()=>setStep(4)} style={{marginTop:8}}>Continue →</Btn></>}
        {step===4&&<>
          <div style={{fontSize:22,fontWeight:800,color:T.tp,marginBottom:6}}>Payment Schedule</div>
          <div style={{fontSize:14,color:T.ts,marginBottom:24}}>Set due date and notification day</div>
          <Card style={{marginBottom:14}}><div style={{fontSize:14,fontWeight:700,color:T.tp,marginBottom:12}}>📅 Rent Due Day</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{[1,2,3,5,10,15,20,25,28].map(d=><div key={d} onClick={()=>setDueDay(String(d))} style={{width:44,height:44,borderRadius:12,background:dueDay===String(d)?T.accent:T.surfaceAlt,border:`1px solid ${dueDay===String(d)?T.accent:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:dueDay===String(d)?T.bg:T.ts,cursor:"pointer",transition:"all 0.2s"}}>{d}</div>)}</div></Card>
          <Card style={{marginBottom:20}}><div style={{fontSize:14,fontWeight:700,color:T.tp,marginBottom:4}}>🔔 Notify Me On Day</div><div style={{fontSize:12,color:T.tm,marginBottom:12}}>Summary of unpaid units sent on this day</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{[1,2,3,4,5,6,7,10,14].map(d=><div key={d} onClick={()=>setNotifyDay(String(d))} style={{width:44,height:44,borderRadius:12,background:notifyDay===String(d)?T.info:T.surfaceAlt,border:`1px solid ${notifyDay===String(d)?T.info:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:notifyDay===String(d)?"#fff":T.ts,cursor:"pointer",transition:"all 0.2s"}}>{d}</div>)}</div></Card>
          <Card style={{marginBottom:24,border:`1px solid ${T.accent}44`,background:T.accentDim}}><div style={{fontSize:13,color:T.accent,lineHeight:1.8}}>📅 Rent due on the <strong>{ord(parseInt(dueDay))}</strong> each month<br/>🔔 Notified on day <strong>{notifyDay}</strong> with unpaid summary<br/>🏢 <strong>{unitNames.length}</strong> units · Default KES <strong>{parseInt(rentAmount)||0}</strong></div></Card>
          <Btn onClick={()=>onSave({name,location,dueDay:parseInt(dueDay),notifyDay:parseInt(notifyDay),rentAmount:parseInt(rentAmount)||0,unitNames})}>🏢 Create Building</Btn>
        </>}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: Add Unit
// ═══════════════════════════════════════════════════════════════════════════════
const AddUnit=({building,onBack,onSave})=>{
  const [unitName,setUnitName]=useState("");
  const [rent,setRent]=useState(building?.units[0]?.rent?.toString()||"");
  const [done,setDone]=useState(false);
  if(done) return (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,gap:20,background:`radial-gradient(ellipse at 50% 30%,${T.accentGlow} 0%,${T.bg} 60%)`}}>
      <div style={{width:80,height:80,borderRadius:24,background:T.accentDim,border:`1px solid ${T.accent}44`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 40px ${T.accentGlow}`}}><CheckIc size={36} color={T.accent}/></div>
      <div style={{fontSize:22,fontWeight:800,color:T.tp,textAlign:"center"}}>Unit Added!</div>
      <div style={{fontSize:14,color:T.ts,textAlign:"center"}}><span style={{color:T.accent,fontWeight:700}}>{unitName}</span> added to {building?.name}</div>
    </div>
  );
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <BH title="Add Unit" sub={building?.name} onBack={onBack}/>
      <div style={{flex:1,overflowY:"auto",scrollbarWidth:"none",padding:"24px 24px 40px"}}>
        <div style={{fontSize:22,fontWeight:800,color:T.tp,marginBottom:6}}>New Unit</div>
        <div style={{fontSize:14,color:T.ts,marginBottom:28}}>Add a unit to <span style={{color:T.accent}}>{building?.name}</span></div>
        <Inp label="Unit Name" placeholder="e.g. House 7, Unit D, Bedsitter" value={unitName} onChange={e=>setUnitName(e.target.value)}/>
        <Inp label="Monthly Rent (KES)" placeholder="e.g. 25000" type="number" value={rent} onChange={e=>setRent(e.target.value)}/>
        <Card style={{marginBottom:28,border:`1px solid ${T.accent}22`}}><div style={{fontSize:13,color:T.ts,lineHeight:1.7}}>💡 After adding, generate an invite link from the unit detail screen.</div></Card>
        <Btn onClick={()=>{if(unitName&&rent){setDone(true);setTimeout(()=>onSave({unitName,rent}),1400);}}} style={{opacity:unitName&&rent?1:0.4}}>Add Unit</Btn>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: Invite
// ═══════════════════════════════════════════════════════════════════════════════
const InviteScreen=({unit,building,onBack})=>{
  const code=`BLDG-${String(building?.id||1).padStart(4,"0")}`;
  const slug=(unit?.name||"unit").toLowerCase().replace(/\s+/g,"-");
  const link=`rentflow.app/join/${code}/${slug}`;
  const [cc,setCc]=useState(false); const [cl,setCl]=useState(false);
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <BH title="Invite Tenant" sub={`${unit?.name} · ${building?.name||"Building"}`} onBack={onBack}/>
      <div style={{flex:1,overflowY:"auto",scrollbarWidth:"none",padding:"20px 24px 40px"}}>
        <div style={{fontSize:12,color:T.tm,letterSpacing:1,fontWeight:700,textTransform:"uppercase",marginBottom:10}}>Building Code</div>
        <Card style={{marginBottom:20,border:`1px solid ${T.accent}44`,background:`linear-gradient(135deg,${T.accentDim},${T.surface})`}}>
          <div style={{textAlign:"center",padding:"12px 0 16px"}}>
            <div style={{fontSize:11,color:T.ts,letterSpacing:3,marginBottom:10,textTransform:"uppercase"}}>Building Code</div>
            <div style={{fontSize:38,fontWeight:800,color:T.accent,letterSpacing:6,marginBottom:6}}>{code}</div>
            <div style={{fontSize:14,color:T.ts}}>Unit: <span style={{color:T.tp,fontWeight:700}}>{unit?.name}</span></div>
          </div>
          <button onClick={()=>{setCc(true);setTimeout(()=>setCc(false),2000);}} style={{width:"100%",background:cc?T.accent:T.accentDim,border:`1px solid ${T.accent}44`,borderRadius:12,padding:"13px",color:cc?T.bg:T.accent,fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all 0.2s"}}>
            {cc?<><CheckIc size={16} color={T.bg}/>Copied!</>:<><CopyIc/>Copy Code</>}
          </button>
        </Card>
        <div style={{fontSize:12,color:T.tm,letterSpacing:1,fontWeight:700,textTransform:"uppercase",marginBottom:10}}>Invite Link</div>
        <Card style={{marginBottom:20}}>
          <div style={{background:T.surfaceAlt,borderRadius:12,padding:"12px 14px",marginBottom:12}}><div style={{fontSize:12,color:T.ts,wordBreak:"break-all",lineHeight:1.5}}>{link}</div></div>
          <button onClick={()=>{setCl(true);setTimeout(()=>setCl(false),2000);}} style={{width:"100%",background:cl?T.accent:T.surfaceAlt,border:`1px solid ${T.border}`,borderRadius:12,padding:"13px",color:cl?T.bg:T.tp,fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all 0.2s"}}>
            {cl?<><CheckIc size={16} color={T.bg}/>Copied!</>:<><CopyIc/>Copy Link</>}
          </button>
        </Card>
        <div style={{fontSize:12,color:T.tm,letterSpacing:1,fontWeight:700,textTransform:"uppercase",marginBottom:10}}>Share via</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24}}>
          {[{l:"WhatsApp",c:"#25D366",bg:"#25D36620",e:"💬"},{l:"SMS",c:T.info,bg:T.infoDim,e:"📱"},{l:"Email",c:T.warn,bg:T.warnDim,e:"✉️"},{l:"More...",c:T.ts,bg:T.surfaceAlt,e:"⋯"}].map(s=>(
            <button key={s.l} style={{background:s.bg,border:`1px solid ${s.c}33`,borderRadius:14,padding:"14px",color:s.c,fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span>{s.e}</span>{s.l}</button>
          ))}
        </div>
        <Card style={{border:`1px solid ${T.border}`}}>
          <div style={{fontSize:13,fontWeight:700,color:T.tp,marginBottom:12}}>How it works</div>
          {[`Download the RentFlow app`,`Enter code ${code} + unit "${unit?.name}"`,`Or tap the invite link to auto-join`,`Mark rent as paid each month`].map((s,i)=>(
            <div key={i} style={{display:"flex",gap:12,marginBottom:i<3?10:0}}>
              <div style={{width:22,height:22,borderRadius:8,background:T.accentDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:T.accent,flexShrink:0}}>{i+1}</div>
              <div style={{fontSize:13,color:T.ts,lineHeight:1.5}}>{s}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: Notification Settings
// ═══════════════════════════════════════════════════════════════════════════════
const NotifSettings=({building,onBack})=>{
  const [dueDay,setDueDay]=useState(building?.dueDay||1);
  const [notifyDay,setNotifyDay]=useState(building?.notifyDay||5);
  const [daily,setDaily]=useState(true); const [tenantReminder,setTenantReminder]=useState(true); const [remDays,setRemDays]=useState(3);
  const [style_,setStyle]=useState("hybrid"); const [saved,setSaved]=useState(false);
  const save=()=>{setSaved(true);setTimeout(()=>{setSaved(false);onBack();},1600);};
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <BH title="Notification Settings" sub={building?.name} onBack={onBack}/>
      <div style={{flex:1,overflowY:"auto",scrollbarWidth:"none",padding:"16px 24px 40px"}}>
        {saved&&<div style={{background:T.accentDim,border:`1px solid ${T.accent}44`,borderRadius:14,padding:"14px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}><div style={{width:28,height:28,background:T.accent,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}><CheckIc size={14}/></div><div style={{fontSize:14,fontWeight:700,color:T.accent}}>Settings saved!</div></div>}
        <Card style={{marginBottom:14}}><div style={{fontSize:14,fontWeight:700,color:T.tp,marginBottom:12}}>📅 Rent Due Day</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{[1,2,3,5,10,15,20,25,28].map(d=><div key={d} onClick={()=>setDueDay(d)} style={{width:42,height:42,borderRadius:11,background:dueDay===d?T.accent:T.surfaceAlt,border:`1px solid ${dueDay===d?T.accent:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:dueDay===d?T.bg:T.ts,cursor:"pointer",transition:"all 0.2s"}}>{d}</div>)}</div></Card>
        <Card style={{marginBottom:14}}><div style={{fontSize:14,fontWeight:700,color:T.tp,marginBottom:4}}>🔔 Notify Me On Day</div><div style={{fontSize:12,color:T.tm,marginBottom:12}}>Summary of unpaid units on this day</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{[1,2,3,4,5,6,7,10,14].map(d=><div key={d} onClick={()=>setNotifyDay(d)} style={{width:42,height:42,borderRadius:11,background:notifyDay===d?T.info:T.surfaceAlt,border:`1px solid ${notifyDay===d?T.info:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:notifyDay===d?"#fff":T.ts,cursor:"pointer",transition:"all 0.2s"}}>{d}</div>)}</div></Card>
        <Card style={{marginBottom:14}}><div style={{fontSize:14,fontWeight:700,color:T.tp,marginBottom:14}}>📊 Notification Style</div>{[{id:"summary",l:"Summary Only",d:"One alert with total unpaid count"},{id:"hybrid",l:"Summary + Details",d:"Summary first, tap for unit list (recommended)"},{id:"perunit",l:"Per Unit",d:"One notification per unpaid unit"}].map(s=><div key={s.id} onClick={()=>setStyle(s.id)} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12,cursor:"pointer"}}><div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${style_===s.id?T.accent:T.border}`,background:style_===s.id?T.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",marginTop:2,flexShrink:0,transition:"all 0.2s"}}>{style_===s.id&&<div style={{width:8,height:8,borderRadius:"50%",background:T.bg}}/>}</div><div><div style={{fontSize:14,fontWeight:600,color:style_===s.id?T.tp:T.ts}}>{s.l}</div><div style={{fontSize:12,color:T.tm}}>{s.d}</div></div></div>)}</Card>
        <Card style={{marginBottom:14}}><div style={{fontSize:14,fontWeight:700,color:T.tp,marginBottom:14}}>⚙️ Additional</div>{[{l:"Daily nudge after notify day",s:"Repeats until all units are paid",v:daily,set:setDaily},{l:"Remind tenants before due",s:`Push reminder ${remDays} days before due date`,v:tenantReminder,set:setTenantReminder}].map((t,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:i===0?16:0}}><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:T.tp}}>{t.l}</div><div style={{fontSize:12,color:T.ts,marginTop:2}}>{t.s}</div></div><Toggle value={t.v} onChange={t.set}/></div>)}{tenantReminder&&<div style={{marginTop:14,padding:"12px",background:T.surfaceAlt,borderRadius:12}}><div style={{fontSize:12,color:T.ts,marginBottom:8}}>Remind tenants how many days before?</div><div style={{display:"flex",gap:8}}>{[1,2,3,5,7].map(d=><div key={d} onClick={()=>setRemDays(d)} style={{flex:1,height:36,borderRadius:10,background:remDays===d?T.accent:T.bg,border:`1px solid ${remDays===d?T.accent:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:remDays===d?T.bg:T.ts,cursor:"pointer",transition:"all 0.2s"}}>{d}d</div>)}</div></div>}</Card>
        <Card style={{marginBottom:24,border:`1px solid ${T.accent}44`,background:T.accentDim}}><div style={{fontSize:12,fontWeight:700,color:T.accent,marginBottom:10,letterSpacing:0.5}}>PREVIEW</div><div style={{background:T.surface,borderRadius:12,padding:"14px"}}><div style={{fontSize:11,color:T.tm,marginBottom:4}}>RentFlow · Day {notifyDay}</div><div style={{fontSize:14,fontWeight:700,color:T.tp,marginBottom:4}}>🔔 {building?.name||"Sunset Apartments"} — Rent</div><div style={{fontSize:13,color:T.ts}}>3 of {building?.units?.length||6} units unpaid. Tap to see who.</div></div></Card>
        <Btn onClick={save}>Save Settings</Btn>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: Notifications
// ═══════════════════════════════════════════════════════════════════════════════
const NotifScreen=()=>(
  <div style={{flex:1,display:"flex",flexDirection:"column"}}>
    <div style={{padding:"20px 24px",flexShrink:0}}><div style={{fontSize:22,fontWeight:800,color:T.tp}}>Notifications</div></div>
    <div style={{flex:1,overflowY:"auto",scrollbarWidth:"none",padding:"0 24px 24px"}}>
      {notifData.map(n=>(
        <Card key={n.id} style={{marginBottom:12,border:n.unread?`1px solid ${n.type==="overdue"?T.overdue+"44":n.type==="pending"?T.pending+"44":T.accent+"44"}`:`1px solid ${T.border}`,background:n.unread?(n.type==="overdue"?"#FF4D6A0A":n.type==="pending"?"#FFB8000A":T.accentDim):T.surface}}>
          <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
            <div style={{width:40,height:40,borderRadius:12,background:n.type==="overdue"?"#FF4D6A22":n.type==="pending"?"#FFB80022":T.accentDim,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>{n.type==="overdue"?"⚠️":n.type==="pending"?"⏳":"✅"}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><div style={{fontSize:14,fontWeight:700,color:T.tp}}>{n.title}</div>{n.unread&&<div style={{width:8,height:8,borderRadius:"50%",background:n.type==="overdue"?T.overdue:n.type==="pending"?T.pending:T.accent,marginTop:4}}/>}</div>
              <div style={{fontSize:13,color:T.ts,marginBottom:6}}>{n.body}</div>
              <div style={{fontSize:11,color:T.tm}}>{n.time}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: Profile
// ═══════════════════════════════════════════════════════════════════════════════
const ProfileScreen=()=>{
  const [langPicker,setLangPicker]=useState(false);
  const [lang,setLang]=useState("en");
  const [dark,setDark]=useState(true); const [push,setPush]=useState(true); const [email,setEmail]=useState(false);
  const cur=languages.find(l=>l.code===lang);
  if(langPicker) return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <BH title="Language" sub="Select your preferred language" onBack={()=>setLangPicker(false)}/>
      <div style={{flex:1,overflowY:"auto",scrollbarWidth:"none",padding:"12px 24px 32px"}}>
        {languages.map(l=><div key={l.code} onClick={()=>{setLang(l.code);setLangPicker(false);}} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:16,background:lang===l.code?T.accentDim:"transparent",border:`1px solid ${lang===l.code?T.accent+"44":"transparent"}`,marginBottom:4,cursor:"pointer",transition:"all 0.2s"}}><div style={{fontSize:28}}>{l.flag}</div><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:T.tp}}>{l.label}</div><div style={{fontSize:13,color:T.ts}}>{l.native}</div></div>{lang===l.code&&<CheckIc size={18} color={T.accent}/>}</div>)}
      </div>
    </div>
  );
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"20px 24px 0",flexShrink:0}}><div style={{fontSize:22,fontWeight:800,color:T.tp,marginBottom:20}}>Profile</div></div>
      <div style={{flex:1,overflowY:"auto",scrollbarWidth:"none",padding:"0 24px 40px"}}>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:28}}>
          <div style={{width:72,height:72,borderRadius:22,background:`linear-gradient(135deg,${T.accent},#00B8FF)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:800,color:T.bg,position:"relative"}}>JK<div style={{position:"absolute",bottom:-2,right:-2,width:24,height:24,background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><PenIc/></div></div>
          <div><div style={{fontSize:19,fontWeight:800,color:T.tp}}>John Kariuki</div><div style={{fontSize:13,color:T.ts}}>john@rentflow.app</div><div style={{fontSize:12,color:T.accent,marginTop:3,fontWeight:600}}>Landlord · 2 Buildings · 9 Units</div></div>
        </div>
        <div style={{fontSize:11,color:T.tm,letterSpacing:1.5,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Account</div>
        <Card style={{marginBottom:20}}>{[["👤","Full Name","John Kariuki"],["📱","Phone","+254 700 123 456"],["✉️","Email","john@rentflow.app"]].map(([ic,l,v],i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:i<2?`1px solid ${T.border}`:"none"}}><div style={{fontSize:18}}>{ic}</div><div style={{flex:1}}><div style={{fontSize:11,color:T.tm}}>{l}</div><div style={{fontSize:14,fontWeight:600,color:T.tp}}>{v}</div></div><PenIc/></div>)}</Card>
        <div style={{fontSize:11,color:T.tm,letterSpacing:1.5,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Language & Region</div>
        <Card style={{marginBottom:20}}>
          <div onClick={()=>setLangPicker(true)} style={{display:"flex",alignItems:"center",gap:12,padding:"4px 0",cursor:"pointer"}}><div style={{width:42,height:42,borderRadius:12,background:T.accentDim,display:"flex",alignItems:"center",justifyContent:"center"}}><GlobeIc/></div><div style={{flex:1}}><div style={{fontSize:11,color:T.tm}}>App Language</div><div style={{fontSize:15,fontWeight:700,color:T.tp}}>{cur?.flag} {cur?.label}</div></div><ChevR/></div>
          <div style={{height:1,background:T.border,margin:"12px 0"}}/>
          <div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:42,height:42,borderRadius:12,background:"#FFB80022",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🇰🇪</div><div style={{flex:1}}><div style={{fontSize:11,color:T.tm}}>Currency</div><div style={{fontSize:15,fontWeight:700,color:T.tp}}>KES — Kenyan Shilling</div></div><ChevR/></div>
        </Card>
        <div style={{fontSize:11,color:T.tm,letterSpacing:1.5,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Notifications</div>
        <Card style={{marginBottom:20}}>{[{l:"Push Notifications",s:"Payment alerts & reminders",v:push,set:setPush,ic:"🔔"},{l:"Email Digests",s:"Weekly summary to your inbox",v:email,set:setEmail,ic:"✉️"}].map((t,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i===0?`1px solid ${T.border}`:"none"}}><div style={{fontSize:20}}>{t.ic}</div><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:T.tp}}>{t.l}</div><div style={{fontSize:12,color:T.ts}}>{t.s}</div></div><Toggle value={t.v} onChange={t.set}/></div>)}</Card>
        <div style={{fontSize:11,color:T.tm,letterSpacing:1.5,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Appearance</div>
        <Card style={{marginBottom:20}}><div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:42,height:42,borderRadius:12,background:"#ffffff11",display:"flex",alignItems:"center",justifyContent:"center"}}><MoonIc/></div><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:T.tp}}>Dark Mode</div><div style={{fontSize:12,color:T.ts}}>Currently {dark?"enabled":"disabled"}</div></div><Toggle value={dark} onChange={setDark}/></div></Card>
        <div style={{fontSize:11,color:T.tm,letterSpacing:1.5,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Danger Zone</div>
        <Card style={{marginBottom:0}}>{[{ic:<LogoutIc/>,l:"Sign Out",c:T.overdue},{ic:<TrashIc/>,l:"Delete Account",c:T.overdue}].map((it,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 0",borderBottom:i===0?`1px solid ${T.border}`:"none",cursor:"pointer"}}>{it.ic}<div style={{fontSize:14,fontWeight:600,color:it.c}}>{it.l}</div></div>)}</Card>
        <div style={{textAlign:"center",marginTop:28}}><div style={{fontSize:12,color:T.tm}}>RentFlow v1.0.0 · Built with ☕ in Nairobi</div></div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: Tenant Home
// ═══════════════════════════════════════════════════════════════════════════════
const TenantHome=()=>{
  const [marked,setMarked]=useState(false);
  const [modal,setModal]=useState(false);
  const [ref,setRef]=useState("");
  return (
    <div style={{flex:1,overflowY:"auto",scrollbarWidth:"none"}}>
      <div style={{padding:"20px 24px",background:`linear-gradient(180deg,${T.accentGlow} 0%,transparent 100%)`}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:24}}>
          <div><div style={{fontSize:13,color:T.ts,marginBottom:4}}>Hello 👋</div><div style={{fontSize:22,fontWeight:800,color:T.tp}}>Grace Akinyi</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:12,color:T.ts}}>Sunset Apartments</div><div style={{fontSize:15,fontWeight:700,color:T.accent}}>House 2</div></div>
        </div>
        <Card style={{background:marked?`linear-gradient(135deg,${T.accentDim},#00E5A011)`:`linear-gradient(135deg,${T.surfaceAlt},${T.surface})`,border:marked?`1.5px solid ${T.accent}44`:`1px solid ${T.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
            <div><div style={{fontSize:12,color:T.ts,marginBottom:4}}>Rent Due</div><div style={{fontSize:28,fontWeight:800,color:T.tp,letterSpacing:-0.5}}>KES 25,000</div><div style={{fontSize:13,color:T.ts,marginTop:4}}>Due: May 1, 2025</div></div>
            <Pill status="pending"/>
          </div>
          {!marked?<Btn onClick={()=>setModal(true)}>Mark as Paid</Btn>:(
            <div style={{background:T.accentDim,borderRadius:12,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:28,height:28,background:T.accent,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}><CheckIc/></div>
              <div><div style={{fontSize:13,fontWeight:700,color:T.accent}}>Marked as Paid</div><div style={{fontSize:11,color:T.ts}}>Awaiting landlord confirmation</div></div>
            </div>
          )}
        </Card>
      </div>
      <div style={{padding:"20px 24px 24px"}}>
        <Card style={{marginBottom:20,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[["Building","Sunset Apts"],["Unit","House 2"],["Landlord","John Kariuki"],["Next Due","Jun 1, 2025"]].map(([l,v])=><div key={l}><div style={{fontSize:11,color:T.tm,marginBottom:4}}>{l}</div><div style={{fontSize:14,fontWeight:600,color:T.tp}}>{v}</div></div>)}
        </Card>
        <SH title="Payment History"/>
        {[{m:"May 2025",s:"pending",r:"Awaiting confirmation",a:25000},{m:"Apr 2025",s:"paid",r:"MPX3801234",a:25000},{m:"Mar 2025",s:"paid",r:"MPX3712098",a:25000}].map((p,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",padding:"14px 0",borderBottom:i<2?`1px solid ${T.border}`:"none"}}>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:T.tp}}>{p.m}</div><div style={{fontSize:12,color:T.ts}}>{p.r}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:700,color:T.tp,marginBottom:4}}>KES {p.a.toLocaleString()}</div><Pill status={p.s}/></div>
          </div>
        ))}
      </div>
      {modal&&(
        <div style={{position:"absolute",inset:0,background:"#000000BB",display:"flex",alignItems:"flex-end",zIndex:100}} onClick={()=>setModal(false)}>
          <div style={{background:T.surface,borderRadius:"24px 24px 0 0",padding:"28px 24px 48px",width:"100%",boxSizing:"border-box"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:40,height:4,background:T.border,borderRadius:2,margin:"0 auto 24px"}}/>
            <div style={{fontSize:20,fontWeight:800,color:T.tp,marginBottom:6}}>Mark Rent as Paid</div>
            <div style={{fontSize:14,color:T.ts,marginBottom:24}}>KES 25,000 — May 2025</div>
            <Inp placeholder="M-Pesa or bank ref e.g. MPX3928110" value={ref} onChange={e=>setRef(e.target.value)} icon={<KeyIc/>} label="Payment Reference (optional)"/>
            <div style={{fontSize:12,color:T.tm,marginBottom:24}}>Your landlord uses this to verify. Adding a ref makes confirmation faster.</div>
            <Btn onClick={()=>{setMarked(true);setModal(false);}}>Confirm Payment Marked</Btn>
            <Btn v="secondary" style={{marginTop:10}} onClick={()=>setModal(false)}>Cancel</Btn>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: Tenant Profile (NEW)
// ═══════════════════════════════════════════════════════════════════════════════
const TenantProfile=()=>{
  const [langPicker,setLangPicker]=useState(false);
  const [lang,setLang]=useState("en");
  const [push,setPush]=useState(true);
  const [dark,setDark]=useState(true);
  const cur=languages.find(l=>l.code===lang);

  if(langPicker) return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <BH title="Language" sub="Select your preferred language" onBack={()=>setLangPicker(false)}/>
      <div style={{flex:1,overflowY:"auto",scrollbarWidth:"none",padding:"12px 24px 32px"}}>
        {languages.map(l=><div key={l.code} onClick={()=>{setLang(l.code);setLangPicker(false);}} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:16,background:lang===l.code?T.accentDim:"transparent",border:`1px solid ${lang===l.code?T.accent+"44":"transparent"}`,marginBottom:4,cursor:"pointer",transition:"all 0.2s"}}><div style={{fontSize:28}}>{l.flag}</div><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:T.tp}}>{l.label}</div><div style={{fontSize:13,color:T.ts}}>{l.native}</div></div>{lang===l.code&&<CheckIc size={18} color={T.accent}/>}</div>)}
      </div>
    </div>
  );

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"20px 24px 0",flexShrink:0}}><div style={{fontSize:22,fontWeight:800,color:T.tp,marginBottom:20}}>My Profile</div></div>
      <div style={{flex:1,overflowY:"auto",scrollbarWidth:"none",padding:"0 24px 40px"}}>

        {/* Avatar */}
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}>
          <div style={{width:72,height:72,borderRadius:22,background:`linear-gradient(135deg,#4D9EFF,#B44DFF)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:800,color:"#fff",position:"relative"}}>
            GA
            <div style={{position:"absolute",bottom:-2,right:-2,width:24,height:24,background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><PenIc/></div>
          </div>
          <div><div style={{fontSize:19,fontWeight:800,color:T.tp}}>Grace Akinyi</div><div style={{fontSize:13,color:T.ts}}>grace@email.com</div><div style={{fontSize:12,color:T.info,marginTop:3,fontWeight:600}}>Tenant · Sunset Apartments</div></div>
        </div>

        {/* My Unit */}
        <div style={{fontSize:11,color:T.tm,letterSpacing:1.5,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>My Unit</div>
        <Card style={{marginBottom:20,border:`1px solid ${T.accent}33`,background:T.accentDim}}>
          {[["🏢","Building","Sunset Apartments"],["🏠","Unit","House 2"],["💰","Monthly Rent","KES 25,000"],["📅","Due Date","1st of month"],["👤","Landlord","John Kariuki"],["📍","Location","Westlands, Nairobi"]].map(([ic,l,v],i,arr)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<arr.length-1?`1px solid ${T.accent}22`:"none"}}>
              <div style={{fontSize:16}}>{ic}</div>
              <div style={{flex:1}}><div style={{fontSize:11,color:T.tm}}>{l}</div><div style={{fontSize:14,fontWeight:600,color:T.tp}}>{v}</div></div>
            </div>
          ))}
        </Card>

        {/* Contact */}
        <div style={{fontSize:11,color:T.tm,letterSpacing:1.5,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Contact Info</div>
        <Card style={{marginBottom:20}}>
          {[["📱","Phone","+254 723 456 789"],["✉️","Email","grace@email.com"]].map(([ic,l,v],i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:i===0?`1px solid ${T.border}`:"none"}}>
              <div style={{fontSize:18}}>{ic}</div>
              <div style={{flex:1}}><div style={{fontSize:11,color:T.tm}}>{l}</div><div style={{fontSize:14,fontWeight:600,color:T.tp}}>{v}</div></div>
              <PenIc/>
            </div>
          ))}
        </Card>

        {/* Language */}
        <div style={{fontSize:11,color:T.tm,letterSpacing:1.5,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Language</div>
        <Card style={{marginBottom:20}}>
          <div onClick={()=>setLangPicker(true)} style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
            <div style={{width:42,height:42,borderRadius:12,background:T.accentDim,display:"flex",alignItems:"center",justifyContent:"center"}}><GlobeIc/></div>
            <div style={{flex:1}}><div style={{fontSize:11,color:T.tm}}>App Language</div><div style={{fontSize:15,fontWeight:700,color:T.tp}}>{cur?.flag} {cur?.label}</div></div>
            <ChevR/>
          </div>
        </Card>

        {/* Notifications */}
        <div style={{fontSize:11,color:T.tm,letterSpacing:1.5,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Notifications</div>
        <Card style={{marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{fontSize:20}}>🔔</div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:T.tp}}>Rent Reminders</div><div style={{fontSize:12,color:T.ts}}>Get reminded before rent is due</div></div>
            <Toggle value={push} onChange={setPush}/>
          </div>
        </Card>

        {/* Appearance */}
        <div style={{fontSize:11,color:T.tm,letterSpacing:1.5,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Appearance</div>
        <Card style={{marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:42,height:42,borderRadius:12,background:"#ffffff11",display:"flex",alignItems:"center",justifyContent:"center"}}><MoonIc/></div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:T.tp}}>Dark Mode</div><div style={{fontSize:12,color:T.ts}}>Currently {dark?"enabled":"disabled"}</div></div>
            <Toggle value={dark} onChange={setDark}/>
          </div>
        </Card>

        {/* Sign out */}
        <Card style={{marginBottom:0}}>
          <div style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}><LogoutIc/><div style={{fontSize:14,fontWeight:600,color:T.overdue}}>Sign Out</div></div>
        </Card>

        <div style={{textAlign:"center",marginTop:28}}><div style={{fontSize:12,color:T.tm}}>RentFlow v1.0.0 · Made with ☕ in Nairobi</div></div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: Join
// ═══════════════════════════════════════════════════════════════════════════════
const JoinScreen=({onJoined})=>{
  const [code,setCode]=useState("");
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",padding:"40px 24px",background:`radial-gradient(ellipse at 50% 0%,${T.accentGlow} 0%,${T.bg} 60%)`}}>
      <div style={{marginBottom:40}}><div style={{fontSize:28,fontWeight:800,color:T.tp,letterSpacing:-0.5,marginBottom:8}}>Join Your Unit</div><div style={{fontSize:15,color:T.ts,lineHeight:1.6}}>Your landlord will share a building code or invite link with you.</div></div>
      <Card style={{marginBottom:24,border:`1px solid ${T.accent}33`}}><div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}><ShareIc/><div style={{fontSize:14,fontWeight:600,color:T.accent}}>Have a link?</div></div><div style={{fontSize:13,color:T.ts}}>Tap the link from WhatsApp or SMS — opens the app and fills your unit automatically.</div></Card>
      <div style={{fontSize:13,color:T.ts,textAlign:"center",marginBottom:16}}>— or enter code manually —</div>
      <Inp placeholder="Building code (e.g. BLDG-0001)" value={code} onChange={e=>setCode(e.target.value)} icon={<KeyIc/>}/>
      <Inp placeholder="Your unit name (e.g. House 2)"/>
      <div style={{flex:1}}/>
      <Btn onClick={onJoined}>Join My Unit</Btn>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function RentFlowApp(){
  const [screen,setScreen]=useState("onboarding");
  const [role,setRole]=useState(null);
  const [navTab,setNavTab]=useState("home");
  const [buildings,setBuildings]=useState(initBuildings);
  const [selBuilding,setSelBuilding]=useState(null);
  const [selUnit,setSelUnit]=useState(null);
  const [showEmpty,setShowEmpty]=useState(false);

  useEffect(()=>{
    const f=document.createElement("link");
    f.href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap";
    f.rel="stylesheet";document.head.appendChild(f);
  },[]);

  const go=(to,data)=>{
    if(to==="building"){setSelBuilding(data);setScreen("building");}
    else if(to==="unit"){setSelUnit(data);setScreen("unit");}
    else if(to==="addUnit"){setSelBuilding(data);setScreen("addUnit");}
    else if(to==="invite"){setSelUnit(data);setScreen("invite");}
    else if(to==="notifSettings"){setSelBuilding(data);setScreen("notifSettings");}
    else setScreen(to);
  };

  const login=r=>{setRole(r);setScreen(r==="tenant"?"join":r==="landlord"?"ftOnboarding":"main");};

  const saveBuilding=data=>{
    const nb={id:buildings.length+1,name:data.name,location:data.location,dueDay:data.dueDay,notifyDay:data.notifyDay,
      units:data.unitNames.map((n,i)=>({id:Date.now()+i,name:n,tenant:"Vacant",phone:"—",rent:data.rentAmount,status:"pending",ref:null}))};
    setBuildings(prev=>[...prev,nb]);
    setScreen("main");setNavTab("home");
  };

  const saveUnit=data=>{
    const nu={id:Date.now(),name:data.unitName,tenant:"Vacant",phone:"—",rent:parseInt(data.rent),status:"pending",ref:null};
    const updated=buildings.map(b=>b.id===selBuilding.id?{...b,units:[...b.units,nu]}:b);
    setBuildings(updated);
    setTimeout(()=>{setSelBuilding(updated.find(b=>b.id===selBuilding.id)||selBuilding);setScreen("building");},1400);
  };

  const liveBuilding=selBuilding?buildings.find(b=>b.id===selBuilding.id)||selBuilding:null;
  const displayBuildings=showEmpty?[]:buildings;

  const render=()=>{
    if(screen==="onboarding")    return <OnboardingScreen onNext={()=>setScreen("auth")}/>;
    if(screen==="auth")          return <AuthScreen onLogin={login}/>;
    if(screen==="ftOnboarding")  return <FirstTimeOnboarding onDone={()=>setScreen("main")}/>;
    if(screen==="join")          return <JoinScreen onJoined={()=>setScreen("main")}/>;
    if(screen==="addBuilding")   return <AddBuilding onBack={()=>{setScreen("main");setNavTab("home");}} onSave={saveBuilding}/>;
    if(screen==="addUnit")       return <AddUnit building={selBuilding} onBack={()=>setScreen("building")} onSave={saveUnit}/>;
    if(screen==="invite")        return <InviteScreen unit={selUnit} building={selBuilding||buildings[0]} onBack={()=>setScreen("unit")}/>;
    if(screen==="notifSettings") return <NotifSettings building={selBuilding} onBack={()=>setScreen("building")}/>;
    if(screen==="reports")       return <ReportsScreen onBack={()=>{setScreen("main");setNavTab("home");}} buildings={buildings}/>;
    if(screen==="building"&&liveBuilding) return <BuildingDetail building={liveBuilding} onBack={()=>{setScreen("main");setNavTab("home");}} onNavigate={go}/>;
    if(screen==="unit"&&selUnit) return <UnitDetail unit={selUnit} onBack={()=>setScreen("building")} onNavigate={go}/>;
    if(screen==="notifications") return <NotifScreen/>;
    if(screen==="main"){
      if(role==="tenant"){
        if(navTab==="home")    return <TenantHome/>;
        if(navTab==="profile") return <TenantProfile/>;
        if(navTab==="notifications") return <NotifScreen/>;
      }
      if(navTab==="home")          return <Dashboard onNavigate={go} buildings={displayBuildings}/>;
      if(navTab==="buildings")     return <BuildingDetail building={buildings[0]} onBack={()=>setNavTab("home")} onNavigate={go}/>;
      if(navTab==="reports")       return <ReportsScreen onBack={()=>setNavTab("home")} buildings={buildings}/>;
      if(navTab==="notifications") return <NotifScreen/>;
      if(navTab==="profile")       return <ProfileScreen/>;
    }
    return null;
  };

  const showLNav=screen==="main"&&role==="landlord";
  const showTNav=screen==="main"&&role==="tenant";
  const landlordNav=[
    {id:"home",   label:"Home",     Icon:HomeIc},
    {id:"reports",label:"Reports",  Icon:ChartIc},
    {id:"notifications",label:"Alerts",Icon:BellIc},
    {id:"profile",label:"Profile",  Icon:UserIc},
  ];
  const tenantNav=[
    {id:"home",   label:"Home",     Icon:HomeIc},
    {id:"notifications",label:"Alerts",Icon:BellIc},
    {id:"profile",label:"Profile",  Icon:UserIc},
  ];

  const btns=[
    {label:"Onboarding",       s:"onboarding",   r:null},
    {label:"Sign In",          s:"auth",          r:null},
    {label:"🆕 First-time",    s:"ftOnboarding",  r:"landlord"},
    {label:"📭 Empty State",   s:"main",          r:"landlord",tab:"home",empty:true},
    {label:"🏢 Dashboard",     s:"main",          r:"landlord",tab:"home",empty:false},
    {label:"📊 Reports",       s:"main",          r:"landlord",tab:"reports",empty:false},
    {label:"➕ Add Building",  s:"addBuilding",   r:"landlord"},
    {label:"🔔 Notif Settings",s:"notifSettings", r:"landlord",b:initBuildings[0]},
    {label:"📨 Invite",        s:"invite",        r:"landlord",b:initBuildings[0],u:initBuildings[0].units[0]},
    {label:"🔔 Alerts",        s:"notifications", r:"landlord"},
    {label:"👤 Profile",       s:"main",          r:"landlord",tab:"profile",empty:false},
    {label:"🏠 Tenant Home",   s:"main",          r:"tenant",  tab:"home"},
    {label:"👤 Tenant Profile",s:"main",          r:"tenant",  tab:"profile"},
    {label:"Join Unit",        s:"join",          r:"tenant"},
  ];

  return (
    <div style={{minHeight:"100vh",background:"#050508",display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{position:"fixed",inset:0,background:`radial-gradient(ellipse at 30% 40%,${T.accentGlow} 0%,transparent 60%),radial-gradient(ellipse at 70% 60%,#4D9EFF11 0%,transparent 60%)`,pointerEvents:"none"}}/>
      <div style={{position:"relative",display:"flex",flexDirection:"column",alignItems:"center",gap:32}}>

        <div style={{textAlign:"center"}}>
          <div style={{fontSize:34,fontWeight:800,color:T.tp,letterSpacing:-1}}>Rent<span style={{color:T.accent}}>Flow</span></div>
          <div style={{fontSize:13,color:T.ts,marginTop:4}}>Interactive Prototype · v1.0 — Complete</div>
        </div>

        {/* Phone */}
        <div style={{width:390,height:844,background:T.bg,borderRadius:44,overflow:"hidden",position:"relative",boxShadow:`0 0 0 10px #1A1A2A,0 0 0 11px #2A2A3A,0 60px 120px #000000CC`,fontFamily:"'DM Sans',sans-serif",display:"flex",flexDirection:"column"}}>
          <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:120,height:30,background:"#000",borderRadius:"0 0 20px 20px",zIndex:10}}/>
          <div style={{height:50,display:"flex",alignItems:"flex-end",justifyContent:"space-between",padding:"0 28px 8px",flexShrink:0}}>
            <span style={{fontSize:15,fontWeight:700,color:T.tp}}>9:41</span>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              {[0,1,2].map(i=>(
                <svg key={i} width="16" height="12" viewBox="0 0 16 12" fill={T.tp}>
                  {i===0&&<><rect x="0" y="4" width="3" height="8" rx="1"/><rect x="4.5" y="2" width="3" height="10" rx="1"/><rect x="9" y="0" width="3" height="12" rx="1"/></>}
                  {i===1&&<path d="M8 9l-2-2a3 3 0 014 0L8 9zm-4-4L2 3a7 7 0 0112 0l-2 2a4 4 0 00-8 0z" stroke={T.tp} strokeWidth="1.5" fill="none" strokeLinecap="round"/>}
                  {i===2&&<><rect x="0" y="2" width="13" height="8" rx="2" stroke={T.tp} strokeWidth="1.5" fill="none"/><rect x="1.5" y="3.5" width="9" height="5" rx="1" fill={T.accent}/><rect x="13.5" y="4" width="2" height="4" rx="1" fill={T.ts}/></>}
                </svg>
              ))}
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto",overflowX:"hidden",scrollbarWidth:"none"}}>{render()}</div>
          {(showLNav||showTNav)&&(
            <div style={{height:80,background:T.surface,borderTop:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-around",flexShrink:0,paddingBottom:12}}>
              {(showTNav?tenantNav:landlordNav).map(({id,label,Icon})=>(
                <div key={id} onClick={()=>{setNavTab(id);setScreen("main");}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",padding:"4px 12px"}}>
                  <Icon a={navTab===id}/>
                  <span style={{fontSize:10,fontWeight:600,color:navTab===id?T.accent:T.tm}}>{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Screen Buttons */}
        <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",maxWidth:560}}>
          {btns.map(({label,s,r,tab,b,u,empty})=>{
            const active=screen===s&&role===r&&(!tab||navTab===tab)&&(empty===undefined||showEmpty===empty);
            return (
              <button key={label} onClick={()=>{
                setRole(r);setScreen(s);
                if(tab)setNavTab(tab);
                if(b)setSelBuilding(b);
                if(u)setSelUnit(u);
                if(empty!==undefined)setShowEmpty(empty);
              }} style={{background:active?T.accent:T.surface,color:active?T.bg:T.ts,border:`1px solid ${active?T.accent:T.border}`,borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all 0.15s"}}>{label}</button>
            );
          })}
        </div>
        <div style={{fontSize:12,color:T.tm,textAlign:"center",maxWidth:480}}>Tap any button to navigate · All screens are fully interactive</div>
      </div>
    </div>
  );
}
