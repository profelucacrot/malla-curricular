# Malla curricular con GitHub Pages + Firebase

Este proyecto permite:

- Visualizar la malla en `index.html`.
- Editar la malla en `editor.html`.
- Guardar cambios en Firebase Realtime Database.
- Sincronizar automáticamente la visualización en otro computador.
- Proteger la edición con Firebase Authentication y reglas de seguridad.

## 1. Crear proyecto Firebase

1. Entra a Firebase Console.
2. Crea un proyecto.
3. Agrega una app web.
4. Copia la configuración web.
5. Pégala en `assets/firebase-config.js`.

## 2. Activar Realtime Database

1. En Firebase Console entra a **Realtime Database**.
2. Crea la base de datos.
3. Puedes partir en modo de prueba solo para cargar datos iniciales.
4. Luego reemplaza las reglas por las reglas seguras de más abajo.

## 3. Activar Firebase Authentication

1. En Firebase Console entra a **Authentication**.
2. Clic en **Get started**.
3. En **Sign-in method**, activa **Email/Password**.
4. En **Users**, crea un usuario administrador, por ejemplo tu correo institucional.
5. Copia el **UID** de ese usuario.

## 4. Agregar el UID administrador en Realtime Database

En Realtime Database, crea esta estructura:

```json
{
  "admins": {
    "PEGAR_UID_DEL_USUARIO": true
  },
  "malla": {
    "cursos": {}
  }
}
```

Reemplaza `PEGAR_UID_DEL_USUARIO` por el UID real del usuario creado en Authentication.

## 5. Reglas seguras recomendadas

En **Realtime Database → Rules**, usa:

```json
{
  "rules": {
    "malla": {
      "cursos": {
        ".read": true,
        ".write": "auth != null && root.child('admins').child(auth.uid).val() === true"
      }
    },
    "admins": {
      ".read": "auth != null && root.child('admins').child(auth.uid).val() === true",
      ".write": false
    }
  }
}
```

Con esto:

- Cualquier persona puede leer la malla desde `index.html`.
- Solo el usuario cuyo UID esté en `admins` puede guardar desde `editor.html`.
- La clave visible `0312` ya no se usa como seguridad.

## 6. Inicializar la malla

1. Abre `editor.html`.
2. Ingresa con el correo y contraseña creados en Firebase Authentication.
3. Presiona **Inicializar con malla.json**.
4. Luego presiona **Guardar en Firebase** si hiciste cambios.

## 7. Subir a GitHub Pages

Sube estos archivos al repositorio:

```text
index.html
editor.html
assets/
malla.json
malla_icinf_volcado.csv
README.md
```

Luego activa GitHub Pages desde:

```text
Settings → Pages → Deploy from branch → main → /root
```

## 8. Prerrequisitos

En el detalle de una asignatura, los prerrequisitos se muestran como:

```text
Nombre Asignatura (Semestre X)
```

Internamente, el campo `Prerrequisitos` sigue guardando los ID separados por `|`, por ejemplo:

```text
7|13
```
