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
            location: "홍문관 앞",
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

    // 재료별 가격 비교 데이터 (Price Comparison)
    priceComparisons: [
        {
            id: 1,
            itemName: "신한 아크릴 물감 50ml",
            price: "4,500원",
            storeName: "호미화방 (홍대)",
            hasReceipt: true,
            date: "2024.03.20"
        },
        {
            id: 2,
            itemName: "신한 아크릴 물감 50ml",
            price: "4,200원",
            storeName: "미림화방 (신촌)",
            hasReceipt: true,
            date: "2024.03.21"
        },
        {
            id: 3,
            itemName: "폼보드 5T A1",
            price: "3,800원",
            storeName: "삼원특수지 (혜화)",
            hasReceipt: false,
            date: "2024.03.18"
        }
    ],

    // 공동구매 데이터 (Group Buy)
    groupBuys: [
        {
            id: 1,
            itemName: "신한 전문가용 과슈 24색",
            targetPrice: "45,000원",
            minParticipants: 10,
            currentParticipants: 7,
            chatLink: "https://open.kakao.com/o/g123456",
            status: "모집 중"
        },
        {
            id: 2,
            itemName: "삼원특수지 롤지 (화이트)",
            targetPrice: "12,000원",
            minParticipants: 5,
            currentParticipants: 3,
            chatLink: "https://open.kakao.com/o/g789012",
            status: "모집 중"
        },
        {
            id: 3,
            itemName: "아크릴 판 3mm 900x600",
            targetPrice: "8,500원",
            minParticipants: 20,
            currentParticipants: 20,
            chatLink: "https://open.kakao.com/o/g345678",
            status: "모집 완료"
        }
    ],

    // 포인트 컬러 설정
    colors: ["#FF3E00", "#00F0FF", "#7FFF00", "#FF00FF", "#FFFF00"]
};
