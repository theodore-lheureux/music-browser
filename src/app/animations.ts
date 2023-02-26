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
    query(':enter', [style({ transform: 'translateX(100%)' })], {
      optional: true,
    }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(
        ':leave',
        [
          animate(
            '400ms ease-in-out',
            style({ transform: 'translateX(-100%)' })
          ),
        ],
        {
          optional: true,
        }
      ),
      query(
        ':enter',
        [animate('400ms ease-in-out', style({ transform: 'none' }))],
        {
          optional: true,
        }
      ),
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
    query(':enter', [style({ transform: 'translateX(-100%)' })], {
      optional: true,
    }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(
        ':leave',
        [
          animate(
            '400ms ease-in-out',
            style({ transform: 'translateX(100%)' })
          ),
        ],
        {
          optional: true,
        }
      ),
      query(
        ':enter',
        [animate('400ms ease-in-out', style({ transform: 'none' }))],
        {
          optional: true,
        }
      ),
    ]),
    query(':enter', animateChild(), { optional: true }),
  ]),
]);
