import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SplitText } from 'gsap/SplitText';

let isRegistered = false;

export function registerGsapPlugins() {
  if (typeof window !== 'undefined' && !isRegistered) {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);
    isRegistered = true;
  }
  return gsap;
}

export { gsap, ScrollTrigger, ScrollToPlugin, SplitText };
