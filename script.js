document.addEventListener('DOMContentLoaded', function () {

    // 0. 이미지 슬라이더 tmp

    const blocks = document.querySelectorAll('.block');

    let userName = '', userGender = '';

    // 모든 조건이 충족되었는지 검사하는 핵심 함수
    function checkBlockCompletion(block, index) {
        const liButtons = block.querySelectorAll('.li-check-btn');
        const allLiChecked = liButtons.length > 0 && Array.from(liButtons).every(btn => btn.classList.contains('active'));

        // 블록 2 특수 조건: 리스트 버튼들 + 퀴즈 정답
        if (index === 1) {
            const numBtn = block.querySelector('#num-button');
            if (allLiChecked && numBtn.disabled) {
                showNextBlock(index);
            }
        } 
        // 리스트 버튼만 있는 일반 블록들 (Block 2~5)
        else if (allLiChecked) {
            showNextBlock(index);
        }
    }

        // 0. 이미지 슬라이더 기능 (우선 실행)
    const slides = document.querySelectorAll('.image-slider-container .slide');
    const indicators = document.querySelectorAll('.slider-indicators .indicator');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    
    if (slides.length > 0) {
        const totalSlides = slides.length;
        let currentSlideIndex = 0;

        function updateSlider() {
            slides.forEach((slide, index) => {
                slide.classList.remove('current', 'next', 'prev', 'hidden');
                
                if (index === currentSlideIndex) {
                    slide.classList.add('current');
                } else if (index === currentSlideIndex + 1) {
                    slide.classList.add('next');
                } else if (index === currentSlideIndex - 1) {
                    slide.classList.add('prev');
                } else {
                    slide.classList.add('hidden');
                }
            });

            // 인디케이터 업데이트
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlideIndex);
            });

            // 버튼 활성화/비활성화 제어
            if (prevBtn) prevBtn.disabled = currentSlideIndex === 0;
            if (nextBtn) nextBtn.disabled = currentSlideIndex === totalSlides - 1;
        }

        function nextSlide() {
            if (currentSlideIndex < totalSlides - 1) {
                currentSlideIndex++;
                updateSlider();
            }
        }

        function prevSlide() {
            if (currentSlideIndex > 0) {
                currentSlideIndex--;
                updateSlider();
            }
        }

        function goToSlide(index) {
            currentSlideIndex = index;
            updateSlider();
        }

        // 이벤트 리스너
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToSlide(index));
        });

        // 키보드 네비게이션
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });

        // 초기 상태 설정
        updateSlider();
    }

    function showNextBlock(currentIndex) {
        const nextBlock = blocks[currentIndex + 1];
        if (!nextBlock) return;

        const nextContent = nextBlock.querySelector('.content');
        if (nextContent.style.display === 'block') return; // 이미 열려있으면 중단

        const lockedIcon = nextBlock.querySelector('.locked');
        const unlockedIcon = nextBlock.querySelector('.unlocked');

        if (lockedIcon && unlockedIcon) {
            lockedIcon.style.display = 'none';
            unlockedIcon.style.display = 'block';
            setTimeout(() => {
                unlockedIcon.style.display = 'none';
                nextContent.style.display = 'block';
            }, 800);
        } else {
            nextContent.style.display = 'block';
        }
    }

    blocks.forEach((block, index) => {
        // 1. 리스트 버튼 클릭 이벤트 등록
        const liButtons = block.querySelectorAll('.li-check-btn');
        liButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.add('active');
                this.innerText = '완료';
                this.disabled = true;
                checkBlockCompletion(block, index);
            });
        });

        // 2. 블록 1: 이름/성별 입력 및 개인정보 동의 체크 (통합 및 수정)
        if (index === 0) {
            block.querySelector('.content').style.display = 'block';
            const btn1 = block.querySelector('#submit-button-1');
            
            btn1.addEventListener('click', () => {
                userName = block.querySelector('#name').value;
                const gender = block.querySelector('input[name="gender"]:checked');
                const privacyCheck = block.querySelector('#privacy-check'); // 체크박스 요소 가져오기

                if (userName && gender) {
                    // 개인정보 동의 여부 확인 (이 부분이 핵심입니다)
                    if (privacyCheck && !privacyCheck.checked) {
                        alert("개인정보 수집 및 이용에 동의해주세요.");
                        return; // 체크 안 되어있으면 여기서 함수 종료 (다음 블록 안 넘어감)
                    }

                    userGender = gender.value;
                    btn1.disabled = true;
                    showNextBlock(index);
                } else { 
                    alert("정보를 입력해주세요."); 
                }
            });
        }

        // 3. 블록 2: 숫자 퀴즈
        if (index === 1) {
            const numBtn = block.querySelector('#num-button');
            const numInput = block.querySelector('#num-input');
            
            numBtn.addEventListener('click', function () {
                if (numInput.value === '2') {
                    this.classList.add('active');
                    this.innerText = '완료';
                    this.disabled = true;
                    checkBlockCompletion(block, index);
                } else {
                    alert('틀렸습니다. 다시 입력해주세요.');
                }
            });
        }

        // 4. 블록 7: 최종 제출 (fetch 로직 포함)
        if (index === 6) {
            const submitBtn2 = block.querySelector('#submit-button-2');
            submitBtn2.addEventListener('click', (e) => {
                const kakaoId = block.querySelector('#kakaoId').value;
                if (!kakaoId) return alert("카카오 ID를 입력하세요.");
                
                const loader = document.getElementById('loading-indicator');
                const botField = document.querySelector('input[name="bot-field"]')?.value || "";
                loader.style.display = 'block';

                fetch('/.netlify/functions/submit', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        name: userName,
                        gender: userGender,
                        kakaoId: kakaoId,
                        botField: botField
                    })
                }).then(res => {
                    if (res.ok) {
                        alert('가입 신청이 완료되었습니다!\n공지방으로 이동합니다.');
                        submitBtn2.disabled = true;
                        // 공지방으로 이동
                        window.location.href = 'https://open.kakao.com/o/g1sCUT8d';
                    } else {
                        alert('가입 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
                    }
                }).catch(err => {
                    console.error('Error:', err);
                    alert('가입 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
                }).finally(() => loader.style.display = 'none');
            });
        }
    });


});
