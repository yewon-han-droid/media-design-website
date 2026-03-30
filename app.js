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

        if (hash === '#home' || hash === '') {
            renderHome();
        } else if (hash === '#material') {
            renderMaterial();
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
            cutter: `<svg viewBox="0 0 50 160"><rect x="15" y="40" width="20" height="120" fill="#FFD700" rx="3"/><rect x="18" y="5" width="14" height="40" fill="#ccc"/><rect x="20" y="60" width="10" height="20" fill="#222" rx="2"/></svg>`,
            person: `<svg viewBox="0 0 60 100">
                <circle cx="30" cy="20" r="15" fill="#FFFF00"/>
                <rect x="20" y="35" width="20" height="40" fill="#000" rx="5"/>
                <rect x="20" y="75" width="8" height="20" fill="#000" rx="2"/>
                <rect x="32" y="75" width="8" height="20" fill="#000" rx="2"/>
                <path d="M15,45 Q5,55 15,65" fill="none" stroke="#FF00FF" stroke-width="4" stroke-linecap="round"/>
                <path d="M45,45 Q55,55 45,65" fill="none" stroke="#FF00FF" stroke-width="4" stroke-linecap="round"/>
            </svg>`
        };
        return objects[type] || '';
    }

    function renderHome() {
        const picker = new ColorPicker(SITE_DATA.colors);
        const section = document.createElement('section');
        section.className = 'home-view';
        section.innerHTML = `
            <div class="hero" style="overflow: hidden;">
                <div style="position: relative; z-index: 5; pointer-events: none;">
                    <h1 class="hero-title">${SITE_DATA.hero.title}</h1>
                    <p class="hero-desc">${SITE_DATA.hero.description}</p>
                </div>

                <!-- 발품 애니메이션 시료 (캔버스 스케일링 도입) -->
                <div class="struggle-container">
                    <div class="struggle-canvas">
                        <div class="store-node node-1"><span>전문점 A<br><small>재고 없음</small></span></div>
                        <div class="store-node node-2"><span>전문점 B<br><small>다 팔림</small></span></div>
                        <div class="store-node node-3"><span>전문점 C<br><small>오늘 휴무</small></span></div>
                        <svg class="struggle-path" viewBox="0 0 1200 800" preserveAspectRatio="none">
                            <path d="M100,500 L400,200 L800,600 L1100,300" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="4" stroke-dasharray="10,15" stroke-linecap="round" />
                        </svg>
                        <!-- 캐릭터는 이제 캔버스 안에서 움직입니다 -->
                        <div class="struggle-character obj-person">${getGraphicObject('person')}</div>
                    </div>
                </div>

                <div class="floating-object obj-poster animate-float">${getGraphicObject('poster')}</div>
                <div class="floating-object obj-clip animate-float" style="animation-delay: -1s;">${getGraphicObject('clip')}</div>
                <div class="floating-object obj-stickers animate-float" style="animation-delay: -2s;">${getGraphicObject('stickers')}</div>
                <div class="floating-object obj-brush animate-float" style="animation-delay: -3s;">${getGraphicObject('brush')}</div>
                <div class="floating-object obj-paint animate-float" style="animation-delay: -4s;">${getGraphicObject('paint')}</div>
                <div class="floating-object obj-mat animate-float" style="animation-delay: -5s;">${getGraphicObject('mat')}</div>
                <div class="floating-object obj-spray animate-float" style="animation-delay: -1.5s;">${getGraphicObject('spray')}</div>
                <div class="floating-object obj-cutter animate-float" style="animation-delay: -2.5s;">${getGraphicObject('cutter')}</div>
                
                <div class="hero-action-area">
                    <button class="btn-hero-main" onclick="location.hash='#material'">
                        지금 재료 찾으러 가기 →
                    </button>
                    <button class="btn-hero-sub" onclick="window.openMapOverlay()">
                        지도로 확인하기
                    </button>
                </div>
            </div>
        `;
        app.appendChild(section);

        // 캔버스 스케일링 초기화
        setTimeout(updateStruggleScale, 50);
    }

    /**
     * 히어로 섹션의 발목 애니메이션 캔버스를 화면 크기에 맞게 스케일링합니다.
     */
    function updateStruggleScale() {
        const container = document.querySelector('.struggle-container');
        const canvas = document.querySelector('.struggle-canvas');
        if (!container || !canvas) return;

        const scaleX = container.offsetWidth / 1200;
        const scaleY = container.offsetHeight / 800;
        canvas.style.transform = `scale(${scaleX}, ${scaleY})`;
    }

    window.addEventListener('resize', updateStruggleScale);
    window.addEventListener('hashchange', () => {
        if (location.hash === '' || location.hash === '#home') {
            setTimeout(updateStruggleScale, 100);
        }
    });

    // --- 재료 등록 모달 로직 ---
    function initModal() {
        if (document.getElementById('reg-modal-overlay')) return;

        const modalHtml = `
            <div id="reg-modal-overlay" class="modal-overlay">
                <div class="reg-modal">
                    <span class="modal-close" onclick="window.closeMaterialModal()">&times;</span>
                    <h2 class="modal-title">재료 제보하기</h2>
                    <form id="material-reg-form" onsubmit="window.handleAddMaterial(event)">
                        <div class="form-group">
                            <label class="form-label">재료명</label>
                            <input type="text" id="reg-item" class="form-input" placeholder="예: 아크릴 물감 12색" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">카테고리</label>
                            <select id="reg-category" class="form-input" required>
                                <option value="페인팅">페인팅</option>
                                <option value="모형 제작">모형 제작</option>
                                <option value="실크스크린">실크스크린</option>
                                <option value="사진">사진</option>
                                <option value="의상 제작">의상 제작</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">구매처 및 가격</label>
                            <input type="text" id="reg-location" class="form-input" placeholder="예: 홍대 호미화방 / 15,000원" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">재료 사진 (이미지 업로드)</label>
                            <input type="file" id="reg-image" class="form-input" accept="image/*" onchange="window.handleImagePreview(this)">
                            <div class="img-preview-container">
                                <img id="img-preview" src="" alt="미리보기" style="display:none;">
                                <span id="img-placeholder" style="color:#aaa; font-size:0.8rem;">선택된 파일 없음</span>
                            </div>
                        </div>
                        <button type="submit" class="btn-submit">등록하기</button>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    window.openMaterialModal = () => {
        initModal();
        document.getElementById('reg-modal-overlay').style.display = 'flex';
    };

    window.closeMaterialModal = () => {
        document.getElementById('reg-modal-overlay').style.display = 'none';
    };

    window.handleImagePreview = (input) => {
        const preview = document.getElementById('img-preview');
        const placeholder = document.getElementById('img-placeholder');
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.style.display = 'block';
                placeholder.style.display = 'none';
            };
            reader.readAsDataURL(input.files[0]);
        }
    };

    window.handleAddMaterial = (event) => {
        event.preventDefault();
        const item = document.getElementById('reg-item').value;
        const category = document.getElementById('reg-category').value;
        const location = document.getElementById('reg-location').value;

        const newMaterial = {
            id: SITE_DATA.materials.length + 1,
            title: item,
            item: item,
            category: category,
            location: location,
            urgency: '매우 급함', // 기본값
            author: '익명',
            date: new Date().toISOString().split('T')[0],
            content: '사용자가 등록한 정보입니다.'
        };

        SITE_DATA.materials.unshift(newMaterial);
        window.closeMaterialModal();
        window.location.hash = '#material'; // 강제 이동
        renderMaterial(); // 재렌더링
        alert('성공적으로 등록되었습니다!');
    };

    // --- 생존 지도 (Map Overlay) 로직 ---
    window.openMapOverlay = () => {
        if (!document.getElementById('map-overlay')) {
            const overlayHtml = `
                <div id="map-overlay" class="map-overlay">
                    <div class="map-container">
                        <span class="map-close" onclick="window.closeMapOverlay()">&times;</span>
                        <div id="map-canvas" class="map-canvas">
                            <!-- SVG 지도는 JS에서 동적으로 생성 -->
                        </div>
                        <div class="map-legend">
                            <div style="margin-bottom:0.5rem; color:#fff; font-weight:900;">[생존 지도 범례]</div>
                            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                                <div style="width:12px; height:12px; background:#FF3E00; border:1px solid #fff; border-radius:50%;"></div> 페인팅
                            </div>
                            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                                <div style="width:12px; height:12px; background:#00F0FF; border:1px solid #fff; border-radius:50%;"></div> 모형 제작
                            </div>
                            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                                <div style="width:12px; height:12px; background:#FF00FF; border:1px solid #fff; border-radius:50%;"></div> 실크스크린
                            </div>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <div style="width:12px; height:12px; background:#7FFF00; border:1px solid #fff; border-radius:50%;"></div> 기타/공통
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', overlayHtml);
        }
        document.getElementById('map-overlay').style.display = 'flex';
        renderCustomMap();
    };

    window.closeMapOverlay = () => {
        document.getElementById('map-overlay').style.display = 'none';
    };

    function renderCustomMap() {
        const canvas = document.getElementById('map-canvas');
        canvas.innerHTML = ''; // 기존 내용 삭제
        
        // Leaflet 지도 초기화 (국민대 중심: 37.6103, 126.9970)
        const map = L.map('map-canvas', {
            zoomControl: false,
            attributionControl: false
        }).setView([37.6103, 126.9970], 16);

        // 다크 테마 타일 레이어 (CartoDB Dark Matter)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
        }).addTo(map);

        // 국민대 주요 건물 좌표 맵핑
        const buildingCoords = {
            '북악관': [37.6120, 126.9975],
            '조형관': [37.6088, 126.9948],
            '공학관': [37.6110, 126.9995],
            '예술관': [37.6085, 126.9960],
            '복지관': [37.6100, 126.9970],
            '과학관': [37.6105, 126.9990],
            '본부관': [37.6112, 126.9970]
        };

        // 데이터 기반 마커 추가
        SITE_DATA.materials.forEach(m => {
            let coords = [37.6103, 126.9970]; // 기본 중앙
            
            for (const bname in buildingCoords) {
                if (m.location.includes(bname)) {
                    coords = buildingCoords[bname];
                    break;
                }
            }

            // 카테고리별 색상
            let color = '#FF3E00'; // 페인팅
            if (m.category === '모형 제작') color = '#00F0FF';
            else if (m.category === '실크스크린') color = '#FF00FF';

            // 커스텀 원형 마커
            const markerIcon = L.divIcon({
                className: 'custom-leaflet-marker',
                html: `<div class="map-marker" style="background:${color}; position:relative; width:20px; height:20px;">
                        <div class="map-tooltip" style="display:none;">
                            <div style="font-size:0.6rem; opacity:0.7;">${m.category}</div>
                            <div style="font-weight:900;">${m.title}</div>
                            <div style="color:${color}; margin-top:4px; font-size:0.7rem;">${m.location}</div>
                        </div>
                       </div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });

            const marker = L.marker(coords, { icon: markerIcon }).addTo(map);
            
            // 마우스 오버 시 툴팁 표시 (CSS 대신 JS로 제어 보강)
            marker.on('mouseover', function() {
                const tooltip = this.getElement().querySelector('.map-tooltip');
                if (tooltip) tooltip.style.display = 'block';
            });
            marker.on('mouseout', function() {
                const tooltip = this.getElement().querySelector('.map-tooltip');
                if (tooltip) tooltip.style.display = 'none';
            });
        });

        // 줌 컨트롤 우측 하단 추가
        L.control.zoom({ position: 'bottomright' }).addTo(map);
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
            <div class="material-header">
                <div>
                    <h2 class="display-title">재료 구하기 / Buy Material</h2>
                    <p>1단계 작업 유형을 선택하면 2단계 긴급도 필터가 나타납니다.</p>
                </div>
                <button class="btn-register-trigger" onclick="window.openMaterialModal()">+ 재료 제보하기</button>
            </div>
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
