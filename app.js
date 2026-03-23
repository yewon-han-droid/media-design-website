/**
 * survival.design - 메인 애플리케이션 로직
 * 해시 기반 라우팅 및 동적 렌더링 처리
 */

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const cursor = document.getElementById('cursor-follower');

    /**
     * 컬러 중복 방지를 위한 컬러 피커 클래스
     * 고유한 색상을 셔플하여 중복 없이 제공합니다.
     */
    class ColorPicker {
        constructor(colors) {
            this.baseColors = [...colors];
            this.pool = [];
        }

        // 색상 풀이 비었을 경우 다시 채우고 섞음
        refreshPool() {
            this.pool = [...this.baseColors].sort(() => Math.random() - 0.5);
        }

        // 중복 없는 다음 색상 반환
        getNext() {
            if (this.pool.length === 0) {
                this.refreshPool();
            }
            return this.pool.pop();
        }
    }

    const globalPicker = new ColorPicker(SITE_DATA.colors);

    // 마우스 커서 효과 및 오브제 인터랙션
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 12 + 'px';
        cursor.style.top = e.clientY - 12 + 'px';

        const objects = document.querySelectorAll('.floating-object');
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

        objects.forEach((obj, idx) => {
            const factor = (idx + 1) * 2;
            obj.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px) rotate(${15 + moveX}deg)`;
        });
    });

    // 커서 색상 및 스케일 인터랙션
    let colorIdx = 0;
    setInterval(() => {
        colorIdx = (colorIdx + 1) % SITE_DATA.colors.length;
        cursor.style.backgroundColor = SITE_DATA.colors[colorIdx];
    }, 2000);

    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('a, button, .card, .add-card');
        if (target) {
            cursor.classList.add('active');
        }
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest('a, button, .card, .add-card');
        if (target) {
            cursor.classList.remove('active');
        }
    });

    // 라우팅 처리
    const router = () => {
        const hash = window.location.hash || '#home';
        app.innerHTML = '';

        if (hash === '#home') {
            renderHome();
        } else if (hash === '#material') {
            renderMaterial();
        } else if (hash === '#feedback') {
            renderPriceComparison();
        } else if (hash === '#seoulspots') {
            renderGroupBuy();
        } else if (hash.startsWith('#detail/')) {
            const id = hash.split('/')[1];
            renderDetail(id);
        }
    };

    window.addEventListener('hashchange', router);
    router();

    // --- 렌더링 함수들 ---

    function getGraphicObject(type) {
        const objects = {
            poster: `<svg viewBox="0 0 100 140"><rect x="5" y="5" width="90" height="130" fill="#FF3E00"/><circle cx="50" cy="50" r="20" fill="#FFFF00"/><rect x="20" y="80" width="60" height="5" fill="#fff"/><rect x="20" y="90" width="40" height="5" fill="#fff"/></svg>`,
            clip: `<svg viewBox="0 0 50 100"><path d="M10,20 V80 Q10,95 25,95 Q40,95 40,80 V20 Q40,5 25,5 Q10,5 10,20 V60 Q10,70 20,70 Q30,70 30,60 V20" fill="none" stroke="#00F0FF" stroke-width="4" stroke-linecap="round"/></svg>`,
            stickers: `<svg viewBox="0 0 100 100"><circle cx="30" cy="30" r="25" fill="#7FFF00"/><circle cx="70" cy="40" r="20" fill="#FF00FF"/><circle cx="45" cy="75" r="15" fill="#FFFF00"/><path d="M25,25 L35,35 M35,25 L25,35" stroke="#000" stroke-width="3"/></svg>`,
            brush: `<svg viewBox="0 0 40 160"><rect x="15" y="60" width="10" height="100" fill="#FF3E00" rx="5"/><rect x="10" y="40" width="20" height="25" fill="#888"/><rect x="8" y="5" width="24" height="40" fill="#444" rx="2"/></svg>`,
            paint: `<svg viewBox="0 0 60 120"><rect x="10" y="20" width="40" height="80" fill="#FF00FF" rx="5"/><rect x="20" y="5" width="20" height="15" fill="#222"/><rect x="15" y="40" width="30" height="40" fill="#fff" opacity="0.5"/></svg>`,
            mat: `<svg viewBox="0 0 200 150"><rect width="200" height="150" fill="#004411" rx="5"/><path d="M0,20 H200 M0,40 H200 M0,60 H200 M0,80 H200 M0,100 H200 M0,120 H200 M20,0 V150 M40,0 V150 M60,0 V150 M80,0 V150 M100,0 V150 M120,0 V150 M140,0 V150 M160,0 V150 M180,0 V150" stroke="#008822" stroke-width="1"/></svg>`,
            spray: `<svg viewBox="0 0 60 140"><rect x="10" y="30" width="40" height="110" fill="#ddd" rx="5"/><rect x="10" y="15" width="40" height="20" fill="#FFFF00" rx="2"/><circle cx="30" cy="10" r="5" fill="#000"/></svg>`,
            cutter: `<svg viewBox="0 0 50 160"><rect x="15" y="40" width="20" height="120" fill="#FFD700" rx="3"/><rect x="18" y="5" width="14" height="40" fill="#ccc"/><rect x="20" y="60" width="10" height="20" fill="#222" rx="2"/></svg>`
        };
        return objects[type] || '';
    }

    function renderHome() {
        const picker = new ColorPicker(SITE_DATA.colors);
        const section = document.createElement('section');
        section.className = 'home-view';
        section.innerHTML = `
            <div class="hero">
                <h1 class="hero-title">${SITE_DATA.hero.title}</h1>
                <p class="hero-desc">${SITE_DATA.hero.description}</p>
                <div class="floating-object obj-poster animate-float">${getGraphicObject('poster')}</div>
                <div class="floating-object obj-clip animate-float" style="animation-delay: -1s;">${getGraphicObject('clip')}</div>
                <div class="floating-object obj-stickers animate-float" style="animation-delay: -2s;">${getGraphicObject('stickers')}</div>
                <div class="floating-object obj-brush animate-float" style="animation-delay: -3s;">${getGraphicObject('brush')}</div>
                <div class="floating-object obj-paint animate-float" style="animation-delay: -4s;">${getGraphicObject('paint')}</div>
                <div class="floating-object obj-mat animate-float" style="animation-delay: -5s;">${getGraphicObject('mat')}</div>
                <div class="floating-object obj-spray animate-float" style="animation-delay: -1.5s;">${getGraphicObject('spray')}</div>
                <div class="floating-object obj-cutter animate-float" style="animation-delay: -2.5s;">${getGraphicObject('cutter')}</div>
                <div class="scroll-indicator" onclick="window.scrollTo({top: window.innerHeight, behavior: 'smooth'})">
                    <span>Scroll Down</span>
                    <div class="arrow"></div>
                </div>
            </div>
            <div class="section-container" id="features">
                <div class="info-grid">
                    ${SITE_DATA.hero.features.map(f => `
                        <div class="info-block">
                            <span class="info-number">0${f.id}</span>
                            <div class="info-text">
                                <h3>${f.title}</h3>
                                <p>${f.desc}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        app.appendChild(section);
    }

    // 전역 상태 (재료 페이지 필터링 등)
    let currentCategory = '전체';
    let currentUrgency = '전체';

    function renderMaterial() {
        const picker = new ColorPicker(SITE_DATA.colors);
        const section = document.createElement('section');
        section.className = 'section-container';

        const urgencies = [
            { label: '매우 급함', key: 'high' },
            { label: '오늘 필요', key: 'medium' },
            { label: '이번 주 필요', key: 'low' }
        ];

        // 필터링 로직
        const filteredMaterials = SITE_DATA.materials.filter(m => 
            (currentCategory === '전체' || m.category === currentCategory) && 
            (currentUrgency === '전체' || m.urgency === currentUrgency)
        );

        let boardHtml = '';
        if (currentCategory === '전체') {
            // 초기 전체 화면: 3컬럼 레이아웃 유지
            let columnsHtml = '';
            urgencies.forEach(urg => {
                const colFiltered = filteredMaterials.filter(m => m.urgency === urg.label);
                columnsHtml += `
                    <div class="urgency-column">
                        <div class="urgency-header">
                            <span>${urg.label}</span>
                            <span style="opacity: 0.5;">${colFiltered.length}</span>
                        </div>
                        ${colFiltered.map(m => `
                            <div class="card urgency-${urg.key}" onclick="location.hash='#detail/material-${m.id}'" style="--shadow-color: ${picker.getNext()}">
                                <span class="card-tag" style="background: var(--accent-1); margin-bottom: 0.5rem; font-size: 0.6rem;">${m.category}</span>
                                <h3>${m.title}</h3>
                                <p><strong>재료:</strong> ${m.item} | <strong>위치:</strong> ${m.location}</p>
                            </div>
                        `).join('')}
                    </div>
                `;
            });
            boardHtml = `<div class="materials-board" style="margin-top: 2rem;">${columnsHtml}</div>`;
        } else {
            // 카테고리 선택 시: 2단계 필터 노출 및 단일 리스트 형태 (또는 강조된 뷰)
            boardHtml = `
                <div class="sub-category-tabs" style="margin-top: 1.5rem; animation: slideDown 0.3s ease-out;">
                    <span style="font-size: 0.8rem; font-weight: 800; margin-right: 15px; color: #888;">긴급도:</span>
                    ${['전체', '매우 급함', '오늘 필요', '이번 주 필요'].map(u => `
                        <button class="sub-tab-btn ${currentUrgency === u ? 'active' : ''}" onclick="window.setUrgency('${u}')">${u}</button>
                    `).join('')}
                </div>
                <div class="grid" style="margin-top: 3rem;">
                    ${filteredMaterials.length > 0 ? filteredMaterials.map(m => `
                        <div class="card urgency-${urgencies.find(u => u.label === m.urgency).key}" onclick="location.hash='#detail/material-${m.id}'" style="--shadow-color: ${picker.getNext()}">
                            <span class="card-tag">${m.urgency}</span>
                            <h3>${m.title}</h3>
                            <p><strong>재료:</strong> ${m.item} | <strong>위치:</strong> ${m.location}</p>
                            <div style="margin-top: 1rem; font-size: 0.8rem; color: #888;">${m.author} · ${m.date}</div>
                        </div>
                    `).join('') : '<p style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #888;">해당하는 게시글이 없습니다.</p>'}
                </div>
            `;
        }

        section.innerHTML = `
            <h2 class="display-title">재료 구하기 / Buy Material</h2>
            <p>1단계 작업 유형을 선택하면 2단계 긴급도 필터가 나타납니다.</p>
            
            <!-- 1단계 상위 카테고리 -->
            <div class="category-tabs" style="margin-top: 2rem;">
                ${['전체', '페인팅', '모형 제작', '실크스크린', '사진', '의상 제작'].map(c => `
                    <button class="tab-btn ${currentCategory === c ? 'active' : ''}" onclick="window.setCategory('${c}')">${c}</button>
                `).join('')}
            </div>

            ${boardHtml}
        `;
        app.innerHTML = ''; // 기존 콘텐츠를 비우고 새로 렌더링 (중첩 방지)
        app.appendChild(section);
    }

    window.setCategory = (cat) => {
        currentCategory = cat;
        currentUrgency = '전체'; // 카테고리 변경 시 긴급도 초기화
        renderMaterial();
    };

    window.setUrgency = (urg) => {
        currentUrgency = urg;
        renderMaterial();
    };

    function renderPriceComparison() {
        const picker = new ColorPicker(SITE_DATA.colors);
        const section = document.createElement('section');
        section.className = 'section-container';

        section.innerHTML = `
            <div style="margin-bottom: 3rem;">
                <h2 class="display-title">재료별 가격 비교 / Price Watch</h2>
                <p>가까운 화방에서 산 재료의 가격을 공유하고 최저가를 찾아보세요.</p>
            </div>
            
            <!-- 입력 폼 섹션 -->
            <div class="price-input-form" style="background: #f8f8f8; padding: 2rem; border-radius: 12px; border-left: 8px solid #000; margin-bottom: 4rem;">
                <h3 style="margin-bottom: 1.5rem; font-size: 1.2rem;">새로운 가격 정보 등록</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 1.5rem;">
                    <div class="form-group">
                        <label style="display: block; font-size: 0.8rem; font-weight: 800; margin-bottom: 5px;">재료 이름</label>
                        <input type="text" id="pc-item" placeholder="예: 신한 아크릴 50ml" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div class="form-group">
                        <label style="display: block; font-size: 0.8rem; font-weight: 800; margin-bottom: 5px;">가격 (원)</label>
                        <input type="text" id="pc-price" placeholder="예: 4,500" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div class="form-group">
                        <label style="display: block; font-size: 0.8rem; font-weight: 800; margin-bottom: 5px;">가게 이름</label>
                        <input type="text" id="pc-store" placeholder="예: 호미화방 (홍대)" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                </div>
                <div style="display: flex; gap: 15px; align-items: center;">
                    <button class="btn-tag" onclick="alert('준비 중인 기능입니다: 영수증 이미지를 선택하세요.')" style="background: #fff; border: 1px dashed #000; padding: 10px 15px; display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <span>📷 영수증 사진 첨부</span>
                    </button>
                    <button class="btn-tag active" onclick="window.addPriceComparison()" style="background: #000; color: #fff; padding: 12px 30px; font-weight: 800; cursor: pointer;">정보 등록하기</button>
                </div>
            </div>

            <!-- 리스트 섹션 -->
            <div class="comparison-list">
                <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 1rem; background: #000; color: #fff; font-size: 0.8rem; font-weight: 800; border-radius: 4px; margin-bottom: 10px;">
                    <span>재료명</span>
                    <span>가격</span>
                    <span>가게</span>
                    <span>영수증 여부</span>
                </div>
                ${SITE_DATA.priceComparisons.map(pc => `
                    <div class="price-row" style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 1.2rem; border-bottom: 1px solid #eee; align-items: center; transition: background 0.2s;">
                        <span style="font-weight: 700;">${pc.itemName}</span>
                        <span style="color: #FF3E00; font-weight: 800;">${pc.price}</span>
                        <span style="color: #666;">${pc.storeName}</span>
                        <span>${pc.hasReceipt ? '✅ 첨부됨' : '❌ 없음'}</span>
                    </div>
                `).join('')}
            </div>
        `;
        app.innerHTML = ''; 
        app.appendChild(section);
    }

    window.addPriceComparison = () => {
        const item = document.getElementById('pc-item').value;
        const price = document.getElementById('pc-price').value;
        const store = document.getElementById('pc-store').value;

        if (!item || !price || !store) {
            alert('모든 정보를 입력해주세요!');
            return;
        }

        const newEntry = {
            id: Date.now(),
            itemName: item,
            price: price.includes('원') ? price : `${price}원`,
            storeName: store,
            hasReceipt: false,
            date: new Date().toLocaleDateString()
        };

        SITE_DATA.priceComparisons.unshift(newEntry);
        renderPriceComparison();
        alert('가격 정보가 등록되었습니다!');
    };

    function renderGroupBuy() {
        const picker = new ColorPicker(SITE_DATA.colors);
        const section = document.createElement('section');
        section.className = 'section-container';

        section.innerHTML = `
            <div style="margin-bottom: 3rem; text-align: center;">
                <h2 class="display-title">공동구매 / Group Buy</h2>
                <p>필요한 재료를 함께 모여 더 저렴하게 구매하세요.</p>
            </div>
            
            <!-- 공동구매 등록 폼 -->
            <div class="groupbuy-form" style="background: #fff; padding: 2.5rem; border: 2px solid #000; border-radius: 20px; box-shadow: 10px 10px 0px #000; margin-bottom: 5rem; max-width: 800px; margin-left: auto; margin-right: auto;">
                <h3 style="margin-bottom: 1.5rem; font-size: 1.3rem; font-weight: 800;">📦 새로운 공동구매 등록</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; margin-bottom: 2rem;">
                    <div class="form-group">
                        <label style="display: block; font-size: 0.8rem; font-weight: 800; margin-bottom: 8px;">재료 이름</label>
                        <input type="text" id="gb-item" placeholder="예: 삼원특수지 롤지" style="width: 100%; padding: 12px; border: 1px solid #eee; background: #f9f9f9; border-radius: 8px;">
                    </div>
                    <div class="form-group">
                        <label style="display: block; font-size: 0.8rem; font-weight: 800; margin-bottom: 8px;">희망 가격</label>
                        <input type="text" id="gb-price" placeholder="예: 12,000원" style="width: 100%; padding: 12px; border: 1px solid #eee; background: #f9f9f9; border-radius: 8px;">
                    </div>
                    <div class="form-group">
                        <label style="display: block; font-size: 0.8rem; font-weight: 800; margin-bottom: 8px;">최소 참여 인원</label>
                        <input type="number" id="gb-min" placeholder="5" style="width: 100%; padding: 12px; border: 1px solid #eee; background: #f9f9f9; border-radius: 8px;">
                    </div>
                </div>
                <div style="margin-bottom: 2rem;">
                    <label style="display: block; font-size: 0.8rem; font-weight: 800; margin-bottom: 8px;">카카오톡 오픈채팅 링크</label>
                    <input type="text" id="gb-link" placeholder="https://open.kakao.com/o/..." style="width: 100%; padding: 12px; border: 1px solid #eee; background: #f9f9f9; border-radius: 8px;">
                </div>
                <button class="btn-tag active" onclick="window.addGroupBuy()" style="width: 100%; background: #000; color: #fff; padding: 15px; font-weight: 800; border-radius: 12px; cursor: pointer; font-size: 1rem; transition: transform 0.2s;">공동구매 글 올리기</button>
            </div>

            <!-- 공동구매 리스트 -->
            <div class="grid">
                ${SITE_DATA.groupBuys.map(gb => {
                    const progress = Math.min((gb.currentParticipants / gb.minParticipants) * 100, 100);
                    const isFull = gb.currentParticipants >= gb.minParticipants;
                    const shadowColor = picker.getNext();
                    
                    return `
                        <div class="card groupbuy-card" style="--shadow-color: ${shadowColor}; padding: 2rem;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
                                <span class="card-tag" style="background: ${isFull ? '#000' : shadowColor}; color: ${isFull ? '#fff' : '#000'}">
                                    ${isFull ? '모집 완료' : '모집 중'}
                                </span>
                                <span style="font-weight: 800; font-size: 1.1rem; color: #FF3E00;">${gb.targetPrice}</span>
                            </div>
                            <h3 style="font-size: 1.4rem; margin-bottom: 1rem; line-height: 1.3;">${gb.itemName}</h3>
                            
                            <!-- 참여 현황 -->
                            <div style="margin: 2rem 0;">
                                <div style="display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 800; margin-bottom: 10px;">
                                    <span>참여 현황</span>
                                    <span>${gb.currentParticipants}/${gb.minParticipants}명</span>
                                </div>
                                <div style="width: 100%; height: 12px; background: #eee; border-radius: 6px; overflow: hidden;">
                                    <div style="width: ${progress}%; height: 100%; background: ${shadowColor}; transition: width 0.5s ease-out;"></div>
                                </div>
                            </div>
                            
                            <button class="btn-tag active" onclick="window.open('${gb.chatLink}', '_blank')" style="width: 100%; background: #FEE500; color: #000; border: none; padding: 12px; font-weight: 800; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                <span style="font-size: 1.2rem;">💬</span> 오픈채팅 참여하기
                            </button>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        app.appendChild(section);
    }

    window.addGroupBuy = () => {
        const item = document.getElementById('gb-item').value;
        const price = document.getElementById('gb-price').value;
        const min = document.getElementById('gb-min').value;
        const link = document.getElementById('gb-link').value;

        if (!item || !price || !min || !link) {
            alert('모든 정보를 입력해주세요!');
            return;
        }

        const newEntry = {
            id: Date.now(),
            itemName: item,
            targetPrice: price.includes('원') ? price : `${price}원`,
            minParticipants: parseInt(min),
            currentParticipants: 1, 
            chatLink: link,
            status: "모집 중"
        };

        SITE_DATA.groupBuys.unshift(newEntry);
        app.innerHTML = '';
        renderGroupBuy();
        alert('공동구매 글이 성공적으로 등록되었습니다!');
    };

    function renderDetail(combinedId) {
        const [type, id] = combinedId.split('-');
        let data = type === 'material' ? SITE_DATA.materials.find(m => m.id == id) : null;
        const section = document.createElement('section');
        section.className = 'section-container';
        section.innerHTML = `
            <button onclick="history.back()" style="border:none; background:none; text-decoration:underline; cursor:pointer; margin-bottom: 2rem;">← Back</button>
            ${data ? `
                <span class="card-tag">${data.urgency}</span>
                <h1 style="font-size: 3rem; margin-bottom: 1rem;">${data.title}</h1>
                <p style="font-size: 1.5rem;">${data.location}에서 ${data.item}을(를) ${data.type}합니다.</p>
                <div style="background: #f0f0f0; padding: 2rem; margin-top: 2rem;">
                    <h3>댓글</h3><p style="color: #888;">작성된 댓글이 없습니다.</p>
                </div>
            ` : '<h1>게시글을 찾을 수 없습니다.</h1>'}
        `;
        app.appendChild(section);
    }
});
