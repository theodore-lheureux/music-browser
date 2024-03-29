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
  transition(
    'index => artist, artist => album, index => album, index => concerts, artist => concerts, concerts => album',
    [
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
    ]
  ),
  transition(
    'artist => index, album => artist, album => index, album => concerts, concerts => artist, concerts => index',
    [
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
    ]
  ),
]);
