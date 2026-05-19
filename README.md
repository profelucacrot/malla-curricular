# Malla Curricular Web

Sitio estático para GitHub Pages con dos páginas:

- `editor.html`: permite editar asignaturas, prerrequisitos, semestre, créditos, horas, área y categoría.
- `index.html`: visualiza la malla en tiempo real desde los datos guardados en el navegador.

## Uso local

Abre `index.html` y `editor.html` con un servidor local. Por ejemplo:

```bash
python -m http.server 8000
```

Luego entra a:

```text
http://localhost:8000/
http://localhost:8000/editor.html
```

## Publicación en GitHub Pages

1. Crea un repositorio.
2. Sube todos estos archivos.
3. En GitHub: Settings → Pages → Deploy from branch → main → `/root`.
4. Abre la URL generada por GitHub Pages.

## Importante

GitHub Pages es estático, por lo que no puede guardar en un servidor.  
Esta versión guarda cambios en `localStorage`, es decir, en el navegador del usuario.

Para persistencia real multiusuario se puede conectar luego a Firebase, Supabase o Google Sheets.
