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
            renderFeedback();
        } else if (hash === '#seoulspots') {
            renderSeoulSpots();
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

    function renderMaterial() {
        const picker = new ColorPicker(SITE_DATA.colors);
        const section = document.createElement('section');
        section.className = 'section-container';

        const urgencies = [
            { label: '매우 급함', key: 'high' },
            { label: '오늘 필요', key: 'medium' },
            { label: '이번 주 필요', key: 'low' }
        ];

        let columnsHtml = '';
        urgencies.forEach(urg => {
            const filtered = SITE_DATA.materials.filter(m => m.urgency === urg.label);
            columnsHtml += `
                <div class="urgency-column">
                    <div class="urgency-header">
                        <span>${urg.label}</span>
                        <span style="opacity: 0.5;">${filtered.length} Items</span>
                    </div>
                    ${filtered.map(m => `
                        <div class="card urgency-${urg.key}" onclick="location.hash='#detail/material-${m.id}'" style="--shadow-color: ${picker.getNext()}">
                            <div style="display: flex; gap: 5px; margin-bottom: 1rem;">
                                <span class="card-tag urgency-fill" style="margin-bottom: 0;">${urg.label}</span>
                                ${m.isExample ? `<span class="card-tag example-tag" style="margin-bottom: 0;">예시</span>` : ''}
                            </div>
                            <h3>${m.title}</h3>
                            <p><strong>재료:</strong> ${m.item} | <strong>지역:</strong> ${m.location}</p>
                            <div style="margin-top: 1rem; font-size: 0.8rem; color: #888;">${m.author} · ${m.date}</div>
                        </div>
                    `).join('')}
                    <div class="add-card" onclick="alert('${urg.label} 게시글 추가 화면으로 이동합니다.')">
                        <div class="plus-icon">+</div>
                        <div style="font-size: 0.8rem; font-weight: 700;">POST NEW</div>
                    </div>
                </div>
            `;
        });

        section.innerHTML = `
            <h2 class="display-title">Material / 재료 급구</h2>
            <p>미대생의 생존은 속도전입니다. 근처의 남는 재료를 찾으세요.</p>
            <div class="materials-board">
                ${columnsHtml}
            </div>
        `;
        app.appendChild(section);
    }

    function renderFeedback() {
        const picker = new ColorPicker(SITE_DATA.colors);
        const section = document.createElement('section');
        section.className = 'section-container';

        const feedbackObjectSets = [
            ['poster', 'clip', 'stickers'],
            ['paint', 'brush', 'spray']
        ];

        section.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
                <div>
                    <h2 class="display-title">Feedback / 빠른 피드백</h2>
                    <p>시안에 대한 동료들의 직관적인 반응을 확인하세요.</p>
                </div>
                <button class="btn-tag" onclick="window.openFeedbackModal()" style="padding: 10px 20px; font-size: 0.9rem; cursor: pointer;">+ 신규 질문 등록하기</button>
            </div>
            
            <div class="grid">
                ${SITE_DATA.feedbacks.map((f, idx) => `
                    <div class="card feedback-card" style="--shadow-color: ${picker.getNext()}">
                        <div class="feedback-visual-area" style="width: 100%; height: 250px; background: #f9f9f9; margin-bottom: 1rem; position: relative; overflow: hidden; border: 1px solid #eee; display: flex; align-items: center; justify-content: center;">
                            ${(feedbackObjectSets[idx] || ['poster', 'brushes', 'paint']).map((objType, objIdx) => `
                                <div class="contained-object animate-float" style="width: ${objType === 'poster' ? '100px' : '60px'}; position: absolute; animation-delay: -${objIdx * 1.5}s; ${objIdx === 0 ? 'top: 20%; left: 20%;' : objIdx === 1 ? 'bottom: 20%; right: 20%;' : 'top: 50%; left: 50%; transform: translate(-50%, -50%);'}">
                                    ${getGraphicObject(objType)}
                                </div>
                            `).join('')}
                        </div>
                        <h3>${f.question}</h3>
                        <div class="tags-row" style="margin-top: 1rem; display: flex; flex-wrap: wrap; gap: 8px;">
                            ${f.tags.map(t => `
                                <button class="btn-tag" onclick="this.classList.toggle('active')" style="border: 1px solid #000; padding: 6px 12px; background: none; cursor: pointer; font-size: 0.75rem; font-weight: 500; transition: all 0.2s;">${t}</button>
                            `).join('')}
                        </div>
                        <div style="margin-top: 1.5rem; font-size: 0.8rem; border-top: 1px dashed #ccc; padding-top: 10px;">
                            <strong>${f.author}</strong> · 댓글 ${f.comments}개
                        </div>
                    </div>
                `).join('')}
                
                <!-- 피드백 추가 카드 -->
                <div class="add-card" onclick="window.openFeedbackModal()" style="--shadow-color: #ddd">
                    <div class="plus-icon">+</div>
                    <span>ASK FOR FEEDBACK</span>
                </div>
            </div>
        `;
        app.appendChild(section);
    }

    // 피드백 등록 모달 열기
    window.openFeedbackModal = () => {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'feedback-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-close" onclick="window.closeFeedbackModal()">&times;</div>
                <h2 class="display-title" style="font-size: 1.5rem; margin-bottom: 2rem;">New Question / 질문</h2>
                <form id="feedback-form">
                    <div class="form-group">
                        <label>질문 내용</label>
                        <textarea name="question" rows="3" placeholder="예: 이 로고의 서체가 전체적인 분위기와 어울리나요?" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>피드백 키워드 (쉼표로 구분)</label>
                        <input type="text" name="tags" placeholder="예: 어울림, 가독성 좋음, 수정 필요">
                    </div>
                    <div class="form-group">
                        <label>작성자</label>
                        <input type="text" name="author" placeholder="이름 또는 닉네임" required>
                    </div>
                    <p style="font-size: 0.7rem; color: #888; margin-bottom: 1.5rem;">* 시각물은 그래픽 오브제들로 자동 생성됩니다.</p>
                    <button type="submit" class="btn-submit">질문 올리기</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('feedback-form').onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const tags = formData.get('tags').split(',').map(t => t.trim()).filter(t => t !== '');

            SITE_DATA.feedbacks.push({
                id: SITE_DATA.feedbacks.length + 1,
                question: formData.get('question'),
                tags: tags.length > 0 ? tags : ["답변 대기"],
                comments: 0,
                author: formData.get('author')
            });

            window.closeFeedbackModal();
            renderFeedback();
            alert('새로운 피드백 요청이 등록되었습니다!');
        };
    };

    window.closeFeedbackModal = () => {
        const modal = document.getElementById('feedback-modal');
        if (modal) modal.remove();
    };

    function renderSeoulSpots() {
        const picker = new ColorPicker(SITE_DATA.colors);
        const section = document.createElement('section');
        section.id = 'map-section';

        const landmarks = [
            { name: 'N Seoul Tower', x: 50, y: 40, icon: '🗼' },
            { name: 'Lotte Tower', x: 80, y: 70, icon: '🏙️' },
            { name: '63 Building', x: 35, y: 65, icon: '🏢' },
            { name: 'Gyeongbokgung', x: 48, y: 25, icon: '🏯' }
        ];

        section.innerHTML = `
            <div class="section-container" style="text-align: center;">
                <h2 class="display-title">Seoul Spots / 지도</h2>
                <p>서울 미대생들의 활동 반경을 한강과 랜드마크 중심으로 확인하세요.</p>
                <button class="btn-tag" onclick="window.openSpotModal()" style="padding: 10px 20px; font-size: 0.9rem; cursor: pointer;">+ 신규 스팟 등록하기</button>
            </div>
            
            <div class="map-container">
                <div class="map-guide-v"></div>
                <div class="map-guide-h"></div>
                <div class="quadrant-label" style="top: 5%; left: 50%; transform: translateX(-50%);">NORTH (강북)</div>
                <div class="quadrant-label" style="bottom: 5%; left: 50%; transform: translateX(-50%);">SOUTH (강남)</div>
                <div class="quadrant-label" style="left: 5%; top: 50%; transform: translateY(-50%);">WEST (강서)</div>
                <div class="quadrant-label" style="right: 5%; top: 50%; transform: translateY(-50%);">EAST (강동)</div>
                ${landmarks.map(l => `
                    <div class="map-landmark" style="left: ${l.x}%; top: ${l.y}%;">
                        <span style="font-size: 1.2rem;">${l.icon}</span>
                        <span>${l.name}</span>
                    </div>
                `).join('')}
                <div id="map-labels-container">
                    ${SITE_DATA.spots.map(s => `
                        <div class="map-label" style="left: ${s.coords.x}%; top: ${s.coords.y}%;" title="${s.note}">
                            ${s.name}
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="section-container">
                <div class="grid" id="spots-grid">
                    ${SITE_DATA.spots.map(s => `
                        <div class="card" style="--shadow-color: ${picker.getNext()}">
                            <span class="card-tag" style="background: ${picker.getNext()}">${s.category}</span>
                            <h3>${s.name}</h3>
                            <p>${s.location} | ${s.note}</p>
                        </div>
                    `).join('')}
                    <div class="add-card" onclick="window.openSpotModal()">
                        <div class="plus-icon">+</div>
                        <span>ADD NEW SPOT</span>
                    </div>
                </div>
            </div>
        `;
        app.appendChild(section);
    }

    // 모달 관리 함수
    window.openSpotModal = () => {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'spot-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-close" onclick="window.closeSpotModal()">&times;</div>
                <h2 class="display-title" style="font-size: 1.5rem; margin-bottom: 2rem;">New Spot / 등록</h2>
                <form id="spot-form">
                    <div class="form-group"><label>장소 명칭</label><input type="text" name="name" required></div>
                    <div class="form-group">
                        <label>카테고리</label>
                        <select name="category">
                            <option>재료상가</option><option>인쇄출력</option><option>디자인서점</option><option>전시/복합공간</option><option>작업실</option>
                        </select>
                    </div>
                    <div class="form-group"><label>지역</label><input type="text" name="location" required></div>
                    <div class="form-group"><label>메모/팁</label><textarea name="note" rows="3" required></textarea></div>
                    <button type="submit" class="btn-submit">등록 완료</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('spot-form').onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            SITE_DATA.spots.push({
                id: SITE_DATA.spots.length + 1,
                name: formData.get('name'),
                category: formData.get('category'),
                location: formData.get('location'),
                note: formData.get('note'),
                coords: { x: 50, y: 50 }
            });
            window.closeSpotModal();
            renderSeoulSpots();
            alert('새로운 디자인 스팟이 등록되었습니다!');
        };
    };

    window.closeSpotModal = () => {
        const modal = document.getElementById('spot-modal');
        if (modal) modal.remove();
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
