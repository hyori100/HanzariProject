## Logger 및 Log 메세지 명세

### 1.  로그 목적과 요구사항

* 서비스 동작 상태 파악
* 장애 파악 & 알람

위 목적으로 작성된 로그를 분석하면 서비스 지표의 확인, 트랜잭션, 성능 등 다양한 정보를 확인할 수 있다.

### 2. 사용할 logging library

* SLF4J : 자바 로깅 시스템을 쉽게 사용할 수 있도록 해주는 **라이브러리**이며, 다양한 자바 로깅 시스템을 사용할 수 있도록 **파사드 패턴(facade pattern)** 및 **추상화**를 통해 로깅 기능을 제공
* log4J : log4j2는 로깅 라이브러리 중 가장 최근에 등장. 기존의 log4j, logback과 비교해보았을 때도 처리량이 월등히 높다.



### 3. 사용할 로그 레벨 (간소화)

1. ~~FATAL~~ : 이미 종료가 되는 시점의 FATAL 로그는 다양한 원인으로 작성되지 않을 확률이 다분. 따라서 반드시 필요한 경우가 아니면 사용하지 않는다. ERROR레벨로 대체.
2. ***ERROR* : 예상/의도하지 않은 오류**를 핸들링하는 시점에 사용. **로그 확인 시 ERROR 위주로 확인**한다면 의도하지 않은 경우만 존재하기 때문에 **빠르게 장애 원인 파악**이 가능.
3. ~~WARN~~ : 동작에는 문제 없지만 이상 발생 가능한 경우. 알람을 제공할 정도의 문제는 아니므로 INFO레벨로 대체한다.
4. ***INFO*** : ERROR와 반대로 **명확한 의도**가 있는 로그들이 모두 INFO 레벨. 시나리오 상 **의도된 Exception이라면 ERROR 레벨로 작성할 이유가 전혀 없다.** Exception을 오류라고 생각하면 그럴 수도 있지만 **Exception은 ‘예외’이기 때문에 의도한 경우에는 INFO로 적는 것이 더 좋다고 생각**
   * 서비스, 도메인의 시나리오 상태 (동작 확인 용도)
   * 서비스, 도메인의 지표 (지표 측정 용도)
5. ***DEBUG*** : **개발 도중** 확인을 위해 필요한 모든 로그들이 해당되는 레벨.
6. ~~TRACE~~ : 개발 시에 필요. 이또한 DEBUG레벨로 대체 가능.



###  4. 로그 작성 시 주의사항

1. 로그파일/DB 생명주기 & 저장소 용량
2. 개인정보
3. 시스템 주요 정보 (시스템 보안, 계정 정보)

* 로그가 저장되는 저장소의 용량, 파일 혹은 DB라도 삭제는 언제할 것인지? 이러한 계획을 명확하게 수립하고 운영해야 디스크 용량 부족과 같은 갑작스러운 장애를 방지할 수 있다.
* 로그에 개인정보, 시스템 계정 정보가 작성되는 경우가 많기에 주의할 필요함.



### 5. 사용할 Logger 명세

1. **Webserver Logger** : 특정 웹사이트에 방문한 사용자들이 언제 , 어디서 , 어떤 페이지를 방문했는지에 대한 정보를 기록하는 **웹서버 로그를 담당**하는 로거.
2. **Engine Logger** : **API 서버 내부 작업에 대한 로그를 담당**하는 로거.



### 6. Log 메세지 명세

1. WebserverLogger : 아파치 웹서버 로그 메세지를 그대로 채용.

   ![그림 1 액세스 로그 구성 예](https://d2.naver.com/content/images/2018/04/elastic_stack-01.png)

   1) 원격호스트 IP주소(요청자)

   2) 요청시간

   3) 'HTTP메소드', '호출 경로', '프로토콜명'

   4) HTTP 상태코드

   5) HTTP 헤더를 제외한 전송 바이트 수

   6) 요청을 처리하는 데 걸린 시간(ms)

   7) 리퍼러(referrer)

2. Engine Logger : 

   ```
   %d{HH:mm:ss.SSS} ${appName} %-5level %logger{36} - %m%n
   ```

   1) %d[] : 로깅 이벤트가 발생한 시간을 기록

   2) ${appName} : 어플리케이션 명

   3) %-5level : Log Level을 5자리로 고정출력(좌측정렬)

   4) %logger{36} : 로거명을 36byte까지 출력

   5) %m : 로그내용 출력 

   6) %n : 플랫폼 종속적인 개행문자 출력

   



### 7. 로그 분석 & 활용을 돕는 도구 및 관련 도구

- `Sentry` : python 으로 작성된 *로그* 취합 및 분석 시스템
- `ElasticSearch` :  텍스트, 숫자, 위치 기반 정보, 정형 및 비정형 데이터 등 모든 유형의 데이터를 위한 분산형 오픈 소스 검색 및 분석 엔진
- `Kibana` : Elasticsearch 데이터를 시각화하고 Elastic Stack을 탐색하게 해주는 무료 오픈 소스 인터페이스
- `logstash` : 다양한 소스에서 데이터를 수집하여 변환한 후 자주 사용하는 저장소로 전달
- `filebeat` : Filebeat는 로그 데이터를 전달하고 중앙화하기 위한 경량의 Producer이다.
- `Splunk` : 웹 기반 인터페이스를 통해 빅데이터를 검색, 모니터링 및 분석하는 비정형 데이터 분석 솔루션
- `fluentd` : [Fluentd](https://www.fluentd.org/)는 로그(데이터) 수집기(collector)다. 보통 로그를 수집하는 데 사용하지만, 다양한 데이터 소스(HTTP, TCP 등)로부터 데이터를 받아올 수 있다. Fluentd로 전달된 데이터는 **tag**, **time**, **record(JSON)** 로 구성된 이벤트로 처리되며, 원하는 형태로 가공되어 다양한 목적지(Elasticsearch, S3, HDFS 등)로 전달될 수 있다.
- `fluentbit` :   Fluent Bit는 다양한 소스에서 데이터 / 로그를 수집하고 통합하여 여러 대상으로 보낼 수 있는 오픈 소스 및 다중 플랫폼 **로그 프로세서 및 전달자** . Docker 및 [Kubernetes](https://fluentbit.io/kubernetes/) 환경 과 완벽하게 호환 된다.



######  추가 키워드

* ELK Stack 모델