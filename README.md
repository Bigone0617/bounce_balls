## TypeScript로 만든 캔버스 위에 바운스 볼

#### 설정

\- 10 ~ 20 개의 공이 랜덤으로 생성됨

\- 공이 날아가는 각도는 0 ~ 360

\- 공은 10 ~ 20px 사이의 랜덤한 반지름

\- 속도는 200 ~ 400px/s

\- 공 또는 벽과 부딪힐 경우 반사각으로 팅김

#### 설명

- class : Canvas, Ball, Loop, BallGenerator
  - Canvas : HTML에 선언한 캔버스의 엘리먼트 및 컨텍스트 반환
  - Ball : 볼 그리기 및 볼 움직임 함수
  - Loop : 캔버스 및 볼을 실제로 그리는 클래스
  - BallGenerator : 볼에 필요한 속성 및 함수를 가진 클래스

<img src="https://github.com/Bigone0617/bounce_balls/blob/master/public/bounceBall.gif"/>
