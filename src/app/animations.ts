import {
  animate,
  animateChild,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
  transition('index => artist', [
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: '3.5rem',
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),
    query(':enter', [style({ left: '100%' })], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', [animate('200ms ease-out', style({ left: '-100%' }))], {
        optional: true,
      }),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
    ]),
    query(':enter', animateChild(), { optional: true }),
  ]),
  transition('artist => index', [
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: '3.5rem',
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),
    query(':enter', [style({ left: '-100%' })], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', [animate('200ms ease-out', style({ left: '100%' }))], {
        optional: true,
      }),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
    ]),
    query(':enter', animateChild(), { optional: true }),
  ]),
]);
