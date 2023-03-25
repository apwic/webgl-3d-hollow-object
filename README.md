# **IF3260_Tugas2_K01_G19 WebGL 3D Hollow Object**
Program ini merupakan aplikasi WebGL yang menampilkan objek *hollow*. Pengguna juga dapat mengatur warna, metode proyeksi, dan pengaturan transformasi objek.

## **Running the Program**
Untuk menjalankan program, buka file `index.html` di browser web yang mendukung WebGL. Contohnya Google Chrome, Mozilla Firefox, dan Safari.

## **Functionality**
### **Model**
Pengguna dapat memilih model yang ingin ditampilkan dengan memilih salah satu dari *checkboxes* berikut:

- Hollow Cube
- Cube
- Triangles

### **Color**
Pengguna dapat memilih warna objek dengan memilih warna dari *color picker*.

### **Projection Method**
Pengguna dapat memilih salah satu dari metode proyeksi berikut untuk objek:

- Orthographic
- Oblique
- Perspective

###  **Rotation, Translation, and Scaling**
Pengguna dapat mengatur pengaturan berikut untuk mentransformasi objek:

- RotationX: Memutar objek sekitar sumbu x.
- RotationY: Memutar objek sekitar sumbu y.
- RotationZ: Memutar objek sekitar sumbu z.
- TranslationX: Memindahkan objek sepanjang sumbu x.
- TranslationY: Memindahkan objek sepanjang sumbu y.
- TranslationZ: Memindahkan objek sepanjang sumbu z.
- ScalingX: Menyusut atau memperbesar objek sepanjang sumbu x.
- ScalingY: Menyusut atau memperbesar objek sepanjang sumbu y.
- ScalingZ: Menyusut atau memperbesar objek sepanjang sumbu z.

Pengguna dapat mengatur setiap pengaturan dengan menggeser *slider* yang sesuai. Nilai saat ini dari setiap pengaturan ditampilkan di sebelah *slider*.

### **Camera**
Pengguna dapat mengatur radius dan *angle* dari camer dengan menggeser *slider* berikut:

- Radius: Jarak dari titik pusat objek ke kamera.
- Angle: Sudut antara sumbu z dan vektor dari titik pusat objek ke kamera.

### **Save and Load Model**
Pengguna dapat memuat model khusus dalam format JSON dengan mengklik tombol Load Model dan memilih file. File harus memiliki ekstensi `.json`. Setelah di-*load*, model khusus akan menggantikan *checkboxes* model yang dipilih. Selain itu, pengguna juga bisa melakukan Save Model dengan mengklik tombol Save Model untuk menyimpan *state* dari program. 