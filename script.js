// ================= ระบบเปลี่ยนหน้า (SPA - Single Page Application) =================
function switchView(targetId) {
    // ซ่อนทุกหน้า
    const views = document.querySelectorAll('.view');
    views.forEach(view => {
        view.classList.remove('active');
        view.classList.add('hidden');
    });

    // แสดงหน้าเป้าหมาย
    const target = document.getElementById(targetId);
    target.classList.remove('hidden');
    // Force Reflow เพื่อให้ Animation ทำงาน
    void target.offsetWidth; 
    target.classList.add('active');

    // เลื่อนกลับไปบนสุดของกล่อง (เฉพาะกล่อง ไม่ใช่ทั้งเว็บ)
    document.querySelector('.app-container').scrollTo({ top: 0, behavior: 'smooth' });
}

// ================= ระบบ Popup (Modals) =================
function closeModal(modalId) { 
    document.getElementById(modalId).classList.add('hidden'); 
}

function openLinkModal(title, url) {
    document.getElementById('modal-link-title').innerText = title;
    document.getElementById('modal-link-url').href = url;
    document.getElementById('modal-link').classList.remove('hidden');
}

function openImageModal(imgSrc) {
    document.getElementById('modal-img-display').src = imgSrc;
    document.getElementById('modal-image').classList.remove('hidden');
}

// ================= ระบบแอดมิน (เปลี่ยนรูป & แก้ข้อความ) =================
const ADMIN_PASSWORD = "ss11";
let currentImageId = null;

function openAdminModal() {
    if (document.body.classList.contains('is-admin')) {
        if(confirm("ออกจากโหมดจัดการร้านใช่หรือไม่? 🌸")) {
            document.body.classList.remove('is-admin');
            document.querySelectorAll('.edit-text').forEach(el => el.setAttribute('contenteditable', 'false'));
        }
        return;
    }
    document.getElementById('admin-error').classList.add('hidden');
    document.getElementById('admin-pass').value = '';
    document.getElementById('modal-admin').classList.remove('hidden');
}

function checkAdmin() {
    // .trim() ช่วยตัดช่องว่างซ้ายขวา และ .toLowerCase() ทำเป็นตัวเล็กกันพลาด
    const pass = document.getElementById('admin-pass').value.trim().toLowerCase();
    
    if (pass === ADMIN_PASSWORD) {
        document.body.classList.add('is-admin');
        closeModal('modal-admin');
        
        // เปิดระบบแก้ข้อความชื่องาน
        document.querySelectorAll('.edit-text').forEach(el => {
            el.setAttribute('contenteditable', 'true');
            // เซฟอัตโนมัติเมื่อพิมพ์เสร็จ
            el.addEventListener('blur', function() {
                if(!this.id) this.id = 'txt-' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem(this.id, this.innerText);
            });
        });
        alert("✨ ล็อกอินสำเร็จ! ✨\nกดที่ไอคอนกล้อง 📸 เพื่อเปลี่ยนรูป หรือกดที่ชื่องานเพื่อพิมพ์แก้ได้เลยค่ะ");
    } else {
        document.getElementById('admin-error').classList.remove('hidden');
    }
}

// การอัปโหลดรูป
function triggerUpload(imgId) {
    currentImageId = imgId;
    document.getElementById('file-uploader').click();
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file && currentImageId) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // อัปเดตหน้าจอ
            document.getElementById(currentImageId).src = e.target.result;
            // เซฟลง Local Storage เครื่อง
            localStorage.setItem(currentImageId, e.target.result);
        }
        reader.readAsDataURL(file);
    }
}

// ================= โหลดข้อมูลตอนเปิดเว็บ =================
window.onload = function() {
    // 1. โหลดรูปที่เคยเปลี่ยนไว้
    document.querySelectorAll('img[id]').forEach(img => {
        const savedImg = localStorage.getItem(img.id);
        if (savedImg) img.src = savedImg;
    });

    // 2. โหลดข้อความที่เคยเปลี่ยนไว้
    document.querySelectorAll('.edit-text').forEach(el => {
        if(el.id) {
            const savedText = localStorage.getItem(el.id);
            if(savedText) el.innerText = savedText;
        }
    });
}
