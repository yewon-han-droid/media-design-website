/**
 * survival.design - 중앙 데이터 관리 파일
 * 초보자도 이 파일의 내용만 수정하면 웹사이트의 콘텐츠를 바꿀 수 있습니다.
 */

const SITE_DATA = {
    // 홈 화면 메인 텍스트
    hero: {
        title: "국민대 조형대를 위한\n재료 생존 지도",
        description: "작업 중 필요한 것들을 빠르게 찾고, 묻고, 참고할 수 있는 미대생 전용 생존 큐레이션 플랫폼입니다.",
        features: [
            { id: 1, title: "재료 구하기", desc: "작업 유형별로 급하게 필요한 재료를 찾으세요." },
            { id: 2, title: "가격 비교", desc: "화방별 재료 가격을 비교하고 최저가를 공유하세요." },
            { id: 3, title: "공동구매", desc: "함께 모여 재료를 더 저렴하게 구매하세요." }
        ]
    },

    // 재료 게시판 데이터 (Material)
    materials: [
        {
            id: 1,
            title: "아크릴 물감 화이트 대용량 구함",
            item: "물감",
            category: "페인팅",
            urgency: "매우 급함",
            location: "북악관 앞",
            author: "김디자인",
            date: "10분 전"
        },
        {
            id: 2,
            title: "우드락 커터기 오늘만 빌려주실 분",
            item: "커터기",
            category: "모형 제작",
            urgency: "오늘 필요",
            location: "조형관 2층",
            author: "박생존",
            date: "1시간 전"
        },
        {
            id: 3,
            title: "실크스크린용 망사 자투리 나눔",
            item: "망사",
            category: "실크스크린",
            urgency: "이번 주 필요",
            location: "실크스크린실",
            author: "이열정",
            date: "2시간 전"
        }
    ],

    // 포인트 컬러 설정
    colors: ["#FF3E00", "#00F0FF", "#7FFF00", "#FF00FF", "#FFFF00"]
};
