document.addEventListener('DOMContentLoaded', function() {
    // Инициализация сцены
    const container = document.getElementById('jet3dview');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    // Камера
    const camera = new THREE.PerspectiveCamera(
        50, 
        container.clientWidth / container.clientHeight, 
        0.1, 
        1000
    );
    camera.position.z = 10;

    // Рендерер
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Освещение
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(1, 1, 1);
    scene.add(light1);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Загрузка GLB модели
    const loader = new THREE.GLTFLoader();

    // Опционально: Draco декодер
    // THREE.DRACOLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/libs/draco/gltf/');
    // loader.setDRACOLoader(new THREE.DRACOLoader());

    loader.load(
        '/models/sukhoi_su-27.glb', // Путь к вашей GLB модели
        function(gltf) {
            const model = gltf.scene;
            
            // Масштабирование
            model.scale.set(0.5, 0.5, 0.5);
            
            // Центрирование
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            
            scene.add(model);
        },
        undefined,
        function(error) {
            console.error('Ошибка загрузки модели:', error);
        }
    );

    // Управление
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Анимация
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // Реакция на изменение размера
    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});