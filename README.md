# <<한자리>> 한글과컴퓨터 IPP 자리 배치 웹 서비스 

## 프로젝트 Frontend 팀원명
- 마효리 [hyori100의 공간](https://github.com/hyori100)
- 노윤지 [yunji98의 공간](https://github.com/yunji98)
- 최유진 [cyj2857의 공간](https://github.com/cyj2857)

## 프로젝트 개요
자리 배치 웹 서비스

## 프로젝트 배경
수작업으로 진행하는 자리배치도 수정작업의 번거로움을 해결하기 위하여 웹 상에서 이루어지는 자리 배치도 서비스를 개발하게 되었습니다.

## 프로젝트 목표
* 자리 배치
```
사원을 배치할 자리를 도면화면에 배치합니다. 
```
* 사원 배치
```
도면화면에 배치한 자리에 사원을 매핑합니다. 
```
* 자리 검색
```
사원이 매핑된 자리를 검색할 수 있습니다.   
```
## 주요 기능별 캡처

1) 로그인 화면입니다.
![1](https://github.com/user-attachments/assets/5449c2c7-0d27-4583-9f48-76c0d8058c4a)
<br />

2) 건물을 선택할 수 있는 화면입니다. 
![2](https://github.com/user-attachments/assets/0907e04f-d8ef-4b70-87d4-ce17b3c8b945)
<br />

3) 층을 선택하여 도면을 확인할 수 있는 화면입니다. 
![3](https://github.com/user-attachments/assets/3880f3dd-d8ae-4e58-b9b8-fc6ffa536954)
<br />

4) 자리 생성 시, 한 번에 몇 개씩/어떤 크기로 생성할 건지 선택 가능합니다.
![4](https://github.com/user-attachments/assets/6bd09385-d56f-46dd-be56-b43d749b2e9e)
<br />

5) 자리를 선택하면 가능한 기능을 선택할 수 있습니다. (사원 매핑, 자리 비우기, 크기 조정, 층간/건물간 이동, 메모 작성)
![5](https://github.com/user-attachments/assets/995923ed-8ebe-4a4b-aa23-03d33d03cac0)
<br />

6) 자리에 사원을 매핑할 수 있습니다.
![6](https://github.com/user-attachments/assets/f49b6c9e-638b-4630-8635-9925aa817f55)
<br />

7) 자리 색상은 부서별로 다르게 표시됩니다.
![7](https://github.com/user-attachments/assets/a66674b0-a5d3-4182-9f76-49f77f1975c4)
<br />

8) 사원을 검색하여 자리의 위치를 확인할 수 있습니다.
![8](https://github.com/user-attachments/assets/5e5dd9bf-fd93-4bea-b6de-59978b2542e1)
<br />
<br />

## 프로젝트 Frontend 기술
* Vue.js 프레임워크를 이용한 웹 어플리케이션 개발
```
프레임워크로 Vue.js를 사용하여 구현된 서비스입니다. 
```
* [**RESTful API 이용**](https://github.com/hyori100/HanzariProject/tree/master/frontendProject/src/store/modules)
```
RESTful API를 호출하여 JSON형식으로 필요한 정보를 알맞게 활용하였습니다. 
```
* [**Fabric.js 라이브러리를 이용하여 Canvas 구현**](https://github.com/hyori100/HanzariProject/blob/master/frontendProject/src/components/AssignSeats.vue)
```
객체 집합이나 사용자 인터랙션을 지원하는 Fabric.js 라이브러리를 사용하여 도면화면으로 보여지는 Canvas를 구현하였습니다.
```
* HTML Document객체 이용
```
Docuemnt객체를 이용하여 HTML요소에 접근하거나, HTML 이벤트 핸들러를 추가하였습니다. 
```

## 프로젝트 기대효과
* 업무효율 극대화
```
1) 수작업으로 진행되는 자리배치도 수정과정이 웹 상에서 이루어짐으로써 사용자들은 자리배치 업무에만 집중 할 수 있게 되므로 이를 통해 업무피로도 감소 효과를 기대해 볼 수 있습니다. 
2) 자리배치도를 공유받기 힘들었던 일반 사원들 또한 간단하게 찾고자 하는 사원의 자리를 찾아볼 수 있습니다. 
```

* 확장성 
```
1) 자리 뿐만이 아니라 물적자산에 대한 개념만 추가해준다면 종합 배치 서비스로 확장이 가능합니다.
2) 현재, 자리로 보여지는 모양이나 형태에 대한 확장을 시도하여 가구배치 인테리어 서비스로도 확장이 가능합니다. 
```

* 접근성 
```
웹 기반 어플리케이션으로써 인터넷, 인트라넷이 사용 가능한 환경이라면 어디서든지 접속하여 이용할 수 있습니다. 따라서, 별도의 프로그램 다운로드 및 설치 과정이 생략되어 접근이 쉽습니다. 
```
