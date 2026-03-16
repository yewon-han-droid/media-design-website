/**
 * survival.design - 중앙 데이터 관리 파일
 * 초보자도 이 파일의 내용만 수정하면 웹사이트의 콘텐츠를 바꿀 수 있습니다.
 */

const SITE_DATA = {
    // 홈 화면 메인 텍스트
    hero: {
        title: "서울 미대생의\n작업 생존 플랫폼",
        description: "작업 중 필요한 것들을 빠르게 찾고, 묻고, 참고할 수 있는 시각디자인 전공자 전용 커뮤니티형 플랫폼입니다.",
        features: [
            { id: 1, title: "재료 구하기", desc: "급하게 필요한 재료를 근처에서 찾으세요." },
            { id: 2, title: "빠른 피드백", desc: "고민 중인 시안에 대한 반응을 확인하세요." },
            { id: 3, title: "디자인 스팟", desc: "서울의 유용한 작업 공간과 인쇄소를 공유합니다." }
        ]
    },

    // 재료 게시판 데이터 (Material)
    materials: [
        {
            id: 1,
            title: "5mm 폼보드 급하게 구합니다",
            item: "폼보드",
            type: "구매",
            location: "국민대 조형관 1층",
            urgency: "매우 급함",
            author: "김디자인",
            date: "10분 전",
            isExample: true
        },
        {
            id: 2,
            title: "3M 스프레이 77 남은 거 나눔해요",
            item: "스프레이",
            type: "나눔",
            location: "상수역 1번 출구",
            urgency: "이번 주 필요",
            author: "이열정",
            date: "1시간 전",
            isExample: true
        },
        {
            id: 3,
            title: "중형 커팅매트 하루만 빌려주실 분?",
            item: "커팅매트",
            type: "빌리기",
            location: "정릉역 2번 출구",
            urgency: "오늘 필요",
            author: "박생존",
            date: "2시간 전",
            isExample: true
        }
    ],

    // 피드백 데이터 (Feedback)
    feedbacks: [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop",
            question: "포스터 타이포 배치 1안과 2안 중 뭐가 나은가요?",
            tags: ["1안 좋아요", "2안 좋아요", "수정 필요"],
            comments: 5,
            author: "최시각"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1541462608141-ad60397d4573?q=80&w=800&auto=format&fit=crop",
            question: "브랜딩 컬러 조합 어떤가요?",
            tags: ["컬러 좋음", "가독성 좋음", "대비 부족"],
            comments: 3,
            author: "한편집"
        }
    ],

    // 서울 디자인 장소 데이터 (Seoul Spots)
    spots: [
        {
            id: 1,
            name: "방산시장",
            location: "을지로",
            category: "재료상가",
            note: "각종 종이와 패키지 재료의 천국. 토요일은 일찍 닫아요.",
            coords: { x: 58, y: 35 } // 강북
        },
        {
            id: 2,
            name: "충무로 인쇄골목",
            location: "충무로",
            category: "인쇄출력",
            note: "포트폴리오 인쇄부터 대형 출력까지. 단골집 하나 만들면 편함.",
            coords: { x: 52, y: 48 } // 남산 근처
        },
        {
            id: 3,
            name: "포스트 포에틱스",
            location: "한남동",
            category: "디자인서점",
            note: "해외 디자인 서적과 매거진 큐레이션이 훌륭함.",
            coords: { x: 62, y: 62 } // 한강변
        },
        {
            id: 4,
            name: "LCDC SEOUL",
            location: "성수",
            category: "전시/복합공간",
            note: "영감을 주는 소품샵과 전시 공간이 많음.",
            coords: { x: 78, y: 45 } // 강북/강변
        },
        {
            id: 5,
            name: "땡스북스",
            location: "홍대",
            category: "디자인서점",
            note: "동네 서점 분위기의 편안한 디자인 서점.",
            coords: { x: 25, y: 40 } // 서쪽 강북
        }
    ],

    // 포인트 컬러 설정
    colors: ["#FF3E00", "#00F0FF", "#7FFF00", "#FF00FF", "#FFFF00"]
};
