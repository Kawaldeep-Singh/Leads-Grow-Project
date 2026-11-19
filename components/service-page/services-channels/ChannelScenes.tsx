'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, registerGsapPlugins } from '@/lib/gsap-register';

type ChannelScenesProps = { activeIndex: number; inView: boolean; reducedMotion: boolean };

function SeoScene() {
  return <g>
    <circle cx="34" cy="35" r="16" fill="#0B0F0D" stroke="#22C55E" strokeWidth="3" data-scene-sweep />
    <path d="m46 47 10 10" stroke="#B6F23D" strokeWidth="4" strokeLinecap="round" />
    <path d="M28 39 36 31 41 35 49 26" fill="none" stroke="#B6F23D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" data-scene-draw pathLength="1" />
    {[0, 1, 2, 3, 4].map((index) => <rect key={index} x={30 + index * 14} y={88 - index * 10} width="8" height={20 + index * 10} rx="2" fill={index === 4 ? '#B6F23D' : '#22C55E'} opacity={index === 4 ? '.95' : '.56'} data-scene-bar />)}
  </g>;
}

function SocialScene() {
  return <g>
    <circle cx="36" cy="42" r="15" fill="#22C55E" fillOpacity=".16" stroke="#22C55E" strokeWidth="2" data-scene-pop />
    <path d="M36 49s-8-5-8-10a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 5-8 10-8 10Z" fill="#B6F23D" data-scene-pop />
    <path d="M67 31h27a9 9 0 0 1 9 9v8a9 9 0 0 1-9 9H81l-8 7v-7h-6a9 9 0 0 1-9-9v-8a9 9 0 0 1 9-9Z" fill="#111815" stroke="#22C55E" strokeWidth="2" data-scene-pop />
    <path d="M72 43h16m-16 7h10" stroke="#B6F23D" strokeWidth="2" strokeLinecap="round" data-scene-draw pathLength="1" />
    <path d="m81 79 14-10m-14 10 16 9" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" data-scene-draw pathLength="1" />
    {[0, 1, 2, 3, 4, 5].map((index) => <circle key={index} cx={72 + (index % 3) * 9} cy={88 + Math.floor(index / 3) * 8} r={index % 2 ? 2.3 : 3} fill="#B6F23D" data-scene-follower />)}
  </g>;
}

function GoogleAdsScene() {
  return <g>
    <rect x="19" y="26" width="82" height="20" rx="10" fill="#111815" stroke="#5B6B63" strokeWidth="2" />
    <circle cx="31" cy="36" r="4" fill="none" stroke="#22C55E" strokeWidth="2" />
    <path d="m34 39 4 4" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
    <path d="M45 36h43" stroke="#5B6B63" strokeWidth="2" strokeLinecap="round" data-scene-draw pathLength="1" />
    <rect x="26" y="55" width="68" height="34" rx="5" fill="#111815" stroke="#22C55E" strokeWidth="2" data-scene-slide />
    <path d="M35 65h25M35 74h47M35 82h32" stroke="#F6FAF7" strokeOpacity=".56" strokeWidth="2" strokeLinecap="round" data-scene-draw pathLength="1" />
    <path d="M78 18v11m-4-4 4 4 4-4" stroke="#B6F23D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-scene-cursor />
    <circle cx="82" cy="72" r="9" fill="none" stroke="#B6F23D" strokeWidth="2" data-scene-ping />
  </g>;
}

function MetaAdsScene() {
  return <g>
    <path d="M24 43c7-18 19-18 27 0s20 18 28 0 20-18 27 0-4 25-15 19M24 43c-6 18 4 25 15 19l12-19c8-18 20-18 28 0l12 19c11 6 21-1 15-19" fill="none" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" data-scene-loop />
    <path d="M39 71h52L78 88H52Z" fill="#111815" stroke="#B6F23D" strokeWidth="2" />
    <path d="M57 89h16v8H57Z" fill="#22C55E" />
    {[0, 1, 2, 3, 4].map((index) => <circle key={index} cx={28 + index * 17} cy="28" r="3" fill="#B6F23D" data-scene-conversion />)}
    {[0, 1, 2].map((index) => <circle key={index} cx={56 + index * 8} cy="104" r="3.5" fill="#B6F23D" data-scene-conversion />)}
  </g>;
}

function LinkedInScene() {
  const points = [[31, 31], [61, 24], [91, 35], [36, 61], [87, 66], [56, 48]] as const;
  const edges = [[0, 1], [1, 2], [0, 3], [1, 5], [2, 4], [3, 5], [5, 4]] as const;
  return <g>
    {edges.map(([a, b], index) => <line key={index} x1={points[a][0]} y1={points[a][1]} x2={points[b][0]} y2={points[b][1]} stroke="#22C55E" strokeOpacity=".6" strokeWidth="2" data-scene-draw pathLength="1" />)}
    {points.map(([x, y], index) => <circle key={index} cx={x} cy={y} r="4" fill="#B6F23D" data-scene-node />)}
    <rect x="37" y="75" width="52" height="28" rx="4" fill="#111815" stroke="#22C55E" strokeWidth="2" />
    <path d="M49 75v-5a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v5M37 86h52m-28-2v5h6v-5" fill="none" stroke="#B6F23D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </g>;
}

function ContentScene() {
  return <g>
    <rect x="30" y="29" width="52" height="63" rx="4" fill="#111815" stroke="#5B6B63" strokeWidth="2" data-scene-card />
    <rect x="39" y="23" width="52" height="63" rx="4" fill="#111815" stroke="#22C55E" strokeWidth="2" data-scene-card />
    <rect x="48" y="17" width="52" height="63" rx="4" fill="#17231D" stroke="#B6F23D" strokeWidth="2" data-scene-card />
    <path d="M57 33h33m-33 8h28m-28 8h34m-34 8h21" stroke="#F6FAF7" strokeOpacity=".66" strokeWidth="2" strokeLinecap="round" data-scene-draw pathLength="1" />
    <path d="m91 19 3-8 3 6 7 1-6 4-1 7-4-6-6-1Z" fill="#B6F23D" data-scene-spark />
  </g>;
}

function SmsScene() {
  return <g>
    <rect x="40" y="14" width="42" height="92" rx="9" fill="#111815" stroke="#22C55E" strokeWidth="3" />
    <rect x="46" y="24" width="30" height="64" rx="3" fill="#0B0F0D" />
    <rect x="51" y="32" width="22" height="12" rx="5" fill="#22C55E" fillOpacity=".45" data-scene-message />
    <rect x="57" y="50" width="18" height="12" rx="5" fill="#B6F23D" fillOpacity=".72" data-scene-message />
    <rect x="50" y="68" width="23" height="12" rx="5" fill="#22C55E" fillOpacity=".55" data-scene-message />
    <circle cx="61" cy="97" r="3" fill="#5B6B63" />
    <path d="m83 79 6 6 12-14" fill="none" stroke="#B6F23D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" data-scene-delivered />
  </g>;
}

function EmailScene() {
  return <g>
    <rect x="21" y="23" width="67" height="44" rx="6" fill="#111815" stroke="#22C55E" strokeWidth="2.5" data-scene-envelope />
    <path d="m23 27 31 24 32-24" fill="none" stroke="#B6F23D" strokeWidth="2.5" strokeLinejoin="round" data-scene-flap />
    {[0, 1, 2].map((index) => <g key={index} data-scene-drip>
      <rect x={67 + index * 14} y={76 + index * 7} width="20" height="14" rx="3" fill="#111815" stroke={index === 2 ? '#B6F23D' : '#22C55E'} strokeWidth="1.6" />
      <path d={`m${69 + index * 14} ${78 + index * 7} 8 6 8-6`} fill="none" stroke="#22C55E" strokeWidth="1.4" />
    </g>)}
    <path d="M34 87a19 19 0 1 0 1-30m0 0 1 11m-1-11-10 3" fill="none" stroke="#B6F23D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" data-scene-retention />
  </g>;
}

function WhatsAppScene() {
  return <g>
    <path d="M21 29a9 9 0 0 1 9-9h60a9 9 0 0 1 9 9v42a9 9 0 0 1-9 9H49L34 93v-13h-4a9 9 0 0 1-9-9Z" fill="#111815" stroke="#22C55E" strokeWidth="2.5" />
    <rect x="32" y="34" width="39" height="15" rx="7" fill="#22C55E" fillOpacity=".32" data-scene-chat />
    <rect x="53" y="55" width="35" height="15" rx="7" fill="#B6F23D" fillOpacity=".26" data-scene-chat />
    <path d="m70 61 3 3 5-6m0 6 3 3 5-6" fill="none" stroke="#B6F23D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" data-scene-ticks />
    <path d="M40 41h22m-4 21h8" stroke="#F6FAF7" strokeOpacity=".7" strokeWidth="2" strokeLinecap="round" />
  </g>;
}

const sceneComponents = [SeoScene, SocialScene, GoogleAdsScene, MetaAdsScene, LinkedInScene, ContentScene, SmsScene, EmailScene, WhatsAppScene];

export function ChannelScenes({ activeIndex, inView, reducedMotion }: ChannelScenesProps) {
  const sceneRef = useRef<SVGSVGElement>(null);
  const Scene = sceneComponents[activeIndex] ?? SeoScene;

  useGSAP(() => {
    registerGsapPlugins();
    const scene = sceneRef.current;
    if (!scene || reducedMotion || !inView) return;
    const timeline = gsap.timeline({ repeat: -1, repeatDelay: 0.12, defaults: { ease: 'expo.out' } });
    const pop = scene.querySelectorAll<SVGElement>('[data-scene-pop], [data-scene-node], [data-scene-follower], [data-scene-conversion]');
    const draw = scene.querySelectorAll<SVGElement>('[data-scene-draw]');
    gsap.set(pop, { transformOrigin: '50% 50%', scale: 0.65, opacity: 0 });
    gsap.set(draw, { strokeDasharray: 1, strokeDashoffset: 1 });
    timeline.to(pop, { scale: 1, opacity: 1, duration: 0.45, stagger: 0.045 }, 0)
      .to(draw, { strokeDashoffset: 0, duration: 0.7, stagger: 0.06, ease: 'power2.inOut' }, 0.15);
    timeline.to(scene.querySelectorAll('[data-scene-bar]'), { scaleY: 1.12, transformOrigin: '50% 100%', duration: 0.34, stagger: 0.05, yoyo: true, repeat: 1 }, 0.25);
    timeline.to(scene.querySelectorAll('[data-scene-follower], [data-scene-message], [data-scene-chat]'), { y: -3, duration: 0.45, stagger: 0.08, yoyo: true, repeat: 1 }, 0.35);
    timeline.to(scene.querySelectorAll('[data-scene-sweep], [data-scene-loop], [data-scene-retention]'), { rotation: 10, transformOrigin: '50% 50%', duration: 0.7, yoyo: true, repeat: 1 }, 0.2);
    timeline.to(scene.querySelectorAll('[data-scene-slide], [data-scene-envelope], [data-scene-card]'), { y: -2, x: 1, duration: 0.38, stagger: 0.06, yoyo: true, repeat: 1 }, 0.3);
    timeline.to(scene.querySelectorAll('[data-scene-cursor], [data-scene-delivered], [data-scene-ticks], [data-scene-spark], [data-scene-ping]'), { opacity: 0.35, scale: 0.88, transformOrigin: '50% 50%', duration: 0.24, stagger: 0.12, yoyo: true, repeat: 1 }, 0.55);
    return () => timeline.kill();
  }, { scope: sceneRef, dependencies: [activeIndex, inView, reducedMotion], revertOnUpdate: true });

  return <svg ref={sceneRef} viewBox="0 0 120 120" className="channel-scenes" aria-hidden="true" focusable="false">
    <Scene />
  </svg>;
}
