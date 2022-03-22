# MEMOIRS

프로젝트를 개발하면서 생각해왔던 것과 어렵고 부족한 부분에 대해 정리한다.

### NestJS를 사용하는 이유

1. TypeScript 사용

자바스크립트를 어느 정도 익숙하게 다룰 수 있게 되면서 타입스크립트를 배워봤는데 타입을 곁들이게 될 시, 사전에 에러를 찾기 쉽다는 막강한 장점을 경험해보고서 기본으로 TypeScript를 채택한 NestJS를 사용해 보고 싶었다.

2. 아키텍처 문제

NodeJS를 사용하면 프로젝트의 구조를 사람마다 다르게 적용시키는 것이 가능하고 내가 나중에 다른 개발자들과 협업을 하게 될 때 프로젝트 구조를 설명해야 하는 일이 생긴다. NestJS를 사용하면 이러한 불편한 점을 개선할 수 있다고 생각했다. 기본적으로 NestJS는 NodeJS의 프레임워크로 프로젝트의 구조를 내맘대로 정하는 것이 아닌 이미 정해져 있는 룰을 따라야 하므로 프로젝트 구조에 대해 크게 신경쓰지 않아도 되는 점이 마음에 들었다.

3. OOP

자바스크립트를 공부하면서 OOP를 같이 사용하게 될 경험이 부족했는데 NestJS는 필요한 기능을 Module로 분리하여 필요한 곳에서 Dependency injection(의존성 주입)을 할 수 있도록 되어있다. 항상 절차적인 프로그래밍을 사용해왔던 것과 다르게 새로운 패러다임으로 프로그래밍 해보고 싶은 욕구가 있었다.

### NestJS에서 사용한 인증방식과 인가방식

- 인증방식

  NestJS 공식 문서에서 권장하는 인증방식은 Passport 이다. 비밀번호를 암호화하기 위해 bcrypt 라이브러리를 사용했고 유저가 로그인을 성공하게 될 시 Passport-Local 전략의 도움을 받아 request 객체에 user 필드를 부여받는다. 추후에 user 필드의 정보를 이용하여 로그인이 되었는지 확인할 수 있다. 인증은 이것만으로도 충분하다. 하지만 페이지를 이동하게 되면 user 필드의 정보가 모두 날아가버리는데 이는 HTTP 프로토콜이 Connenctionless(비연결상태)이기 때문이다. 유저가 페이지를 이동할 때마다 로그인을 해야한다면 아무도 이용하지 않게 될 겁니다.

- 인가방식

  이를 해결하기 위해 권한 인가(Authorization)를 해야 하는데 가장 기본적인 인가방식은 쿠키와 세션을 활용하는 방법이 있지만 NestJS에서 추천하는 방법은 JWT를 이용하는 것이다. 유저가 최초로 로그인을 성공했을 때 access token을 발급하고 그 이후로부터 HTTP 헤더의 베어러 토큰에 access token을 추가하여 페이지를 이동하거나 새로고침해도 헤더의 베어러 토큰에 들어있는 access token이 유효한지 검증하여 로그인이 계속해서 이어질 수 있도록 하는 방법이다.(베어러 토큰에 토큰을 부여하는 것은 프론트 단에서 해결한다) 이는 JWT 전략을 사용해야 가능한 것으로 만약 JWT 전략 없이 로그아웃을 진행하려 한다면 현재 로그인 되어있는 상태가 아니므로 에러가 발생할 것이다.

  팁) 매번 로그인 해주면 되지, 인가가 왜 필요한가??

  1. 로그인은 꽤 무거운 작업이다. db에 저장된 사용자 계정의 해시값 등을 꺼내온 다음, 이것들이 사용자의 암호를 복잡한 알고리즘으로 계산한 값과 일치하는지 확인하는 과정 등을 거쳐야하기 때문이다.

  2. 또한, 매 요청마다 아이디와 패스워드가 전송되는 것도 보안상 위험하다.

요약 ->

1. [프론트엔드] ID와 비밀번호를 준다.

2. [백엔드] ID와 비밀번호를 검증하고 AccessToken을 반환한다.

3. [프론트엔드] AccessToken을 받아 다음 api호출부터 헤더에 붙여준다.

4. [백엔드] api호출시 AccessToken이 유효한지 확인하여 처리한다.

### 한 단계 더 생각해본 로그인 구현방식

로그인 후에 사용자에게 권한을 허락함으로서 서버의 자원을 활용할 수 있게 되었다. 문제는 브라우저에서 새로고침이나 종료가 발생한 후 다시 웹사이트로 돌아온다면 서버는 사용자가 누구인지 기억하고 있지 않을 것이다. 발급된 access token은 단지 서버에서 보내 준 json이기 때문에 브라우저가 기억할 수 없다. 사용자가 다시 방문했을 때 누구인지 기억해내기 위해서는 아래와 같은 저장소를 활용하는 것이 일반적이다.

1. LocalStorage
2. Cookie

access token을 2개의 저장소 중 한 곳에 저장하여 사용자가 다시 재방문 했을 때 로그인으로 안내하지 않고 저장소에 저장되어 있는 값을 서버로 전송해 인가를 받는 것이다. LocalStorage에 저장하는 방법은 XSS 취약점이 발생한다. Cookie 역시 XSS 취약점이 발생하지만 어느정도의 XSS는 막아줄 수 있으므로 여기서는 Cookie 저장소를 이용하도록 한다.

팁) XSS 공격 vs CSRF 공격

- XSS 공격

XSS 공격은 사용자가 특정 웹사이트를 신뢰한다는 점을 노린 것이다. 사용자가 웹사이트에 정보를 요청할 때 공격자가 악성 스크립트를 심어 서버에 요청하도록 만든다. 그 결과로 LocalStorage 또는 Cookie 속의 정보를 탈취해 갈 수 있다.

- CSRF 공격

CSRF 공격은 특정 웹사이트가 사용자를 신뢰한다는 점을 노린 것이다. XSS 공격으로 탈취된 사용자의 민감한 정보를 이용해 자신이 웹사이트로부터 인증 받은 사용자인 것처럼 위장해 사용자의 의도와 무관하게 공격자의 의도대로 요청하는 공격을 말한다.

로그인 후 서버로부터 브라우저 쿠키 속에 access token을 부여받게 된다면 사용자가 다시 접속했을 때 쿠키 속의 access token을 서버로 전송해 사용자임을 인증 받을 수 있으므로 재 로그인 없이도 계속 인가받을 수 있다.(이것을 silent refresh라고 한다)

### 두 단계 더 생각해본 로그인 구현방식

access token을 쿠키에 저장했을 때 생기는 문제점이 있습니다. 쿠키 저장소가 XSS 공격을 막아줄 수 있지만 완벽하지는 않기 때문입니다. 만약에 access token이 탈취되었다고 가정했을 때 공격자가 악성 행위를 가하게 되면 서버 측에서 취할 수 있는 방어방법은 존재하지 않습니다. JWT 토큰은 한번 발급 되면 만료기간이 지날 때까지 유효하기 때문에 탈취 되버리면 그저 공격자가 무엇을 하든지 간에 지켜볼 수 밖에 없는 것 입니다.

그래서 access token이 탈취되는 것을 방지하기 위해 refresh token을 같이 사용하게 됩니다. refresh token이란 accessToken의 수명이 다했을 때 accessToken을 재발행 받기 위한 토큰입니다.

구현 방식

1. [프론트엔드] ID와 비밀번호를 준다.

2. [백엔드] ID와 비밀번호를 검증하고 AccessToken과 RefreshToken을 반환해준다. RefreshToken은 쿠키로 발급, AccessToken은 변수로 발급된다.

3. [프론트엔드] 반환받은 AccessToken을 매 api 호출마다 헤더에 붙여서 전송한다.

4. [백엔드] api호출시 헤더의 AccessToken을 확인하고 유효한지, 만료기간이 지났는지를 체크 후 api를 동작시킨다.

5. [프론트엔드] 브라우저에 접속하거나 페이지가 새로고침 될 때마다 백엔드에 RefreshToken을 붙여 SilentRefresh 요청을 보낸다.

6. [백엔드] SilentRefresh 요청이 들어올 경우, 쿠키 저장소의 RefreshToken을 검증한 후, 맞다면 RefreshToken과 새로운 AccessToken 만료 시간을 반환한다.

7. [프론트엔드] SilentRefresh 결과 반환된 RefreshToken을 쿠키 저장소에, 그리고 AccessToken과 만료기간을 헤더에 저장하여 다음 api호출에 사용한다.

RefreshToken은 보호된 리소스에 접근하기 위한 토큰은 아니다. 진짜 보호해야할 정보는 AccessToken 속에 들어있고 AccessToken을 탈취될 것을 방지하기 위해 쿠키 저장소에 RefreshToken을 대신 저장하여 그로부터 검증받은 AccessToken 만이 제어할 수 있습니다.(통상적으로 RefreshToken이 AccessToken 보다 만료기간이 길다) 즉, RefreshToken을 사용한 의미는 AccessToken을 한 단계 감싸주는 역할을 한다고 볼 수 있습니다.

### 세 단계 더 생각해본 로그인 구현방식

#### RefreshToken을 사용한 이유

만약 access token의 만료 기간을 길게 잡아 이것만 사용하게 한다면 access token이 탈취 되었을 때 서버에서 아무런 방어적인 행동을 할 수 없습니다. 그래서 클라이언트 측에 2개의 토큰을 주게 됩니다. access token을 서버에게 전송해 인가 작업이 이루어지고, refresh token은 access token을 발급할 때만 서버에 전송합니다. 만약 refresh token이 탈취되어 해커가 새로운 access token을 요구해 발급받을 수 있습니다만 refresh token을 서버에서 지워버려 access token을 발급하지 못하게 할 수도 있습니다.

추가 구현 방식

1. [프론트엔드] ID와 비밀번호를 준다.

2. [백엔드] ID와 비밀번호를 검증하고 AccessToken과 RefreshToken을 반환해준다. RefreshToken은 쿠키로 발급, AccessToken은 변수로 발급하고 RefreshToken은 데이터베이스에 저장합니다.

3. [프론트엔드] SilentRefresh 요청을 한다.

4. [백엔드] SilentRefresh 요청을 받으면 RefreshToken이 DB 내의 RefreshToken과 같은 값인지 비교하여 맞다면 맞다면 RefreshToken과 새로운 AccessToken 만료 시간을 반환한다.

5. [프론트엔드] 공격자가 RefreshToken을 탈취하여 서버에 AccessToken을 요청한다.

6. [백엔드] RefreshToken이 비이상적으로 요청된 경우, 서버에서 데이터베이스 내의 RefreshToken을 삭제해 더이상 AccessToken을 발급하지 못하도록 막는다.

#### 실수한 부분

SlientRefresh를 구현할 때 새로고침이 발생할 때마다 요청하도록 구현했었는데 이렇게 하게되면 RefreshToken이 만료되기 전에 웹사이트를 방문하기만 한다면 무한 로그인을 할수도 있을 것 같다. 굉장히 편할 것 같다고 생각해서 만들어봤는데 다른 사람들이 만든 방법을 찾아보니 보안적인 면에서 좋지 않은 것 같다고 생각이 든다. 적어도 RefreshToken이 만료되면 로그인을 다시 하도록 유도하는 것이 좋은 방법인 것 같다.

정상적인 구현 방식

1. [프론트엔드] ID와 비밀번호를 준다.

2. [백엔드] ID와 비밀번호를 검증하고 AccessToken과 RefreshToken, AccessToken의 만료시간을 반환해준다. 이 때 생성한 RefreshToken은 DB에 {ID,RefreshToken}으로 저장한다.

3. [프론트엔드] 반환받은 AccessToken을 매 api 호출마다 헤더에 붙여서 전송한다.

4. [백엔드] api호출시 헤더의 AccessToken을 확인하고 유효한지, 만료기간이 지났는지를 체크 후 api를 동작시킨다.

5. [프론트엔드] AccessToken의 만료 기간이 지나거나, 30초 미만으로 남았다면, 백엔드에 RefreshToken을 붙여 SilentRefresh 요청을 보낸다.

6. [백엔드] SilentRefresh 요청이 들어올 경우, RefreshToken이 DB에 있는 것인지 확인한 후, 맞다면 AccessToken과 새로운 AccessToken 만료 시간을 반환한다.

7. [프론트엔드] SilentRefresh 결과 반환된 AccessToken과 만료기간을 저장하여 다음 api호출에 사용한다.

AccessToken이 만료될 즈음에 SilentRefresh를 요청하는 것이다. 이렇게 하면 적어도 RefreshToken의 기간이 만료될 때 적어도 다시한번 로그인 하게 만들 수 있을 것 같다.
