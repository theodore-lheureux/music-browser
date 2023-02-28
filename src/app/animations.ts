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
  transition('index => artist, artist => album, index => album', [
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: '3.5rem',
          left: 0,
          width: '100%',
          willChange: 'transform',
        }),
      ],
      { optional: true }
    ),
    query(
      ':enter',
      [
        style({
          webkitTransform: 'translateX(100%)',
          transform: 'translateX(100%)',
        }),
      ],
      {
        optional: true,
      }
    ),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(
        ':leave',
        [
          animate(
            '400ms ease-in-out',
            style({
              webkitTransform: 'translateX(-100%)',
              transform: 'translateX(-100%)',
            })
          ),
        ],
        {
          optional: true,
        }
      ),
      query(
        ':enter',
        [
          animate(
            '400ms ease-in-out',
            style({
              webkitTransform: 'none',
              transform: 'none',
            })
          ),
        ],
        {
          optional: true,
        }
      ),
    ]),
    query(':enter', animateChild(), { optional: true }),
  ]),
  transition('artist => index, album => artist, album => index', [
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
    query(
      ':enter',
      [
        style({
          webkitTransform: 'translateX(-100%)',
          transform: 'translateX(-100%)',
        }),
      ],
      {
        optional: true,
      }
    ),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(
        ':leave',
        [
          animate(
            '400ms ease-in-out',
            style({
              webkitTransform: 'translateX(100%)',
              transform: 'translateX(100%)',
            })
          ),
        ],
        {
          optional: true,
        }
      ),
      query(
        ':enter',
        [
          animate(
            '400ms ease-in-out',
            style({
              webkitTransform: 'none',
              transform: 'none',
            })
          ),
        ],
        {
          optional: true,
        }
      ),
    ]),
    query(':enter', animateChild(), { optional: true }),
  ]),
]);
