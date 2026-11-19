export const NAV_ROUTE_MAP = {
  Home: { path: '/', exact: true },
  About: { path: '/about', exact: false },
  Services: { path: '/services', exact: false },
} as const;

export const HOME_SCROLL_NAV_MAP = [
  { id: 'services', key: 'Services' },
  { id: 'tech-stack', key: 'Tech Stack' },
  { id: 'testimonials', key: 'Testimonials' },
  { id: 'cta', key: 'Contact' },
] as const;

export type ActiveNavKey = keyof typeof NAV_ROUTE_MAP | (typeof HOME_SCROLL_NAV_MAP)[number]['key'];

export function getRouteActiveNavKey(pathname: string): ActiveNavKey | null {
  for (const [key, route] of Object.entries(NAV_ROUTE_MAP) as [keyof typeof NAV_ROUTE_MAP, (typeof NAV_ROUTE_MAP)[keyof typeof NAV_ROUTE_MAP]][]) {
    if (route.exact ? pathname === route.path : pathname === route.path || pathname.startsWith(`${route.path}/`)) {
      return key;
    }
  }
  return null;
}
