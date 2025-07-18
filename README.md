# Shopper Earnings - Aplicación de Gestión de Pedidos

Una aplicación web completa para gestionar pedidos y ganancias como shopper, usando localStorage para funcionar en cualquier hosting gratuito.

## 🚀 Características

### ✨ Funcionalidades Principales
- **Sistema de Autenticación**: Login y registro local seguro
- **Gestión de Pedidos**: Registro, cálculo automático de ganancias y historial completo
- **Configuración de Tarifas**: Tarifas base personalizables y valores por SKU/kilómetro
- **Resumen de Ganancias**: Vista semanal automática y filtros personalizados
- **Almacenamiento Local**: Todos los datos se guardan en localStorage del navegador

### 📱 Diseño y UX
- **Responsive**: Diseño mobile-first compatible con todos los dispositivos
- **Intuitivo**: Navegación por pestañas clara con iconos
- **Profesional**: Paleta de colores moderna y tipografía legible
- **Interactivo**: Animaciones suaves y micro-interacciones
- **Accesible**: Botones de tamaño táctil y validación visual

## 🛠️ Instalación y Despliegue

### Opción 1: GitHub Pages (Recomendado)

1. **Crear repositorio en GitHub**:
   - Ve a [GitHub](https://github.com) y crea un nuevo repositorio
   - Nómbralo `shopper-earnings` (o el nombre que prefieras)
   - Márcalo como público

2. **Subir archivos**:
   - Descarga todos los archivos del proyecto
   - Súbelos a tu repositorio de GitHub
   - Asegúrate de que `index.html` esté en la raíz

3. **Habilitar GitHub Pages**:
   - Ve a Settings > Pages en tu repositorio
   - Source: Deploy from a branch
   - Branch: main / (root)
   - Guarda la configuración
   - Tu sitio estará disponible en: `https://tu-usuario.github.io/shopper-earnings`

### Opción 2: Netlify

1. **Crear cuenta en Netlify**:
   - Ve a [Netlify](https://netlify.com) y crea una cuenta gratuita

2. **Desplegar sitio**:
   - Arrastra la carpeta con todos los archivos a Netlify
   - O conecta tu repositorio de GitHub
   - El sitio se desplegará automáticamente

### Opción 3: Otros Hostings Gratuitos

La aplicación funciona en cualquier hosting que soporte archivos estáticos:
- **Vercel**: Conecta tu repositorio de GitHub
- **Surge.sh**: `npm install -g surge` y luego `surge`
- **Firebase Hosting**: Solo para archivos estáticos
- **Heroku**: Con buildpack estático

## 📋 Manual de Usuario

### 🔐 Registro e Inicio de Sesión

1. **Primera vez**:
   - Abre la aplicación en tu navegador
   - Haz clic en "Registrarse"
   - Ingresa tu email y contraseña (mínimo 6 caracteres)
   - Confirma tu contraseña
   - Haz clic en "Registrarse"

2. **Siguientes veces**:
   - Ingresa tu email y contraseña
   - Haz clic en "Iniciar Sesión"

### 📝 Gestión de Pedidos

#### Registrar Nuevo Pedido
1. Ve a la pestaña "Pedidos"
2. Completa el formulario:
   - **Nombre del Pedido**: Ej: "Pedido Supermercado ABC"
   - **Tarifa Base**: Selecciona entre las dos tarifas configuradas
   - **Cantidad de SKUs**: Número de productos diferentes
   - **Kilómetros**: Distancia recorrida
3. Ve el cálculo automático de ganancias en tiempo real
4. Haz clic en "Guardar Pedido"

#### Ver Historial
1. Ve a la pestaña "Historial"
2. Ve todos tus pedidos ordenados por fecha
3. Usa la barra de búsqueda para filtrar por nombre o fecha
4. Elimina pedidos individuales si es necesario

### ⚙️ Configuración de Tarifas

1. Ve a la pestaña "Tarifas"
2. Configura las **Tarifas Base**:
   - Personaliza nombres (ej: "Supermercado Local", "Supermercado Premium")
   - Establece valores en pesos chilenos (CLP)
3. Configura las **Tarifas Adicionales**:
   - **Valor por SKU**: Ganancia por cada producto diferente
   - **Valor por KM**: Ganancia por kilómetro recorrido
4. Haz clic en "Guardar Configuración"

### 📊 Resumen de Ganancias

1. Ve a la pestaña "Resumen"
2. Ve estadísticas automáticas:
   - **Total General**: Suma de todas las ganancias
   - **Promedio Semanal**: Ganancia promedio por semana
   - **Total Pedidos**: Cantidad total de pedidos
3. Usa filtros por fecha para períodos específicos
4. Ve el desglose semanal automático (Lunes a Domingo)

## 🔧 Características Técnicas

### Tecnologías Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Almacenamiento**: localStorage del navegador
- **Hosting**: Compatible con cualquier hosting estático
- **Diseño**: CSS Grid, Flexbox, Mobile-First

### Estructura de Datos

Los datos se almacenan en localStorage con las siguientes claves:

```javascript
// Usuarios registrados
shopperApp_users: [
  {
    id: "user_123456789_abc123",
    email: "usuario@email.com",
    password: "hash_de_contraseña",
    createdAt: "2024-01-01T00:00:00.000Z"
  }
]

// Usuario actual (sesión)
shopperApp_currentUser: {
  id: "user_123456789_abc123",
  email: "usuario@email.com",
  loginTime: "2024-01-01T10:00:00.000Z"
}

// Pedidos por usuario
shopperApp_orders_[userId]: [
  {
    id: "order_123456789_def456",
    name: "Pedido Supermercado ABC",
    tariffType: "tariff1",
    skuCount: 15,
    kilometers: 5.2,
    earnings: 8300,
    createdAt: "2024-01-01T14:30:00.000Z"
  }
]

// Configuración por usuario
shopperApp_settings_[userId]: {
  tariff1Name: "Supermercado Local",
  tariff1Value: 5000,
  tariff2Name: "Supermercado Premium", 
  tariff2Value: 7000,
  skuValue: 150,
  kmValue: 200
}
```

### Seguridad y Privacidad

- **Datos Locales**: Todos los datos se almacenan solo en tu navegador
- **Sin Servidor**: No se envían datos a servidores externos
- **Privacidad Total**: Solo tú tienes acceso a tus datos
- **Respaldo Manual**: Puedes exportar/importar datos si es necesario

### Compatibilidad

- **Navegadores**: Chrome, Firefox, Safari, Edge (versiones modernas)
- **Dispositivos**: Escritorio, tablet, móvil
- **Sistemas**: Windows, macOS, Linux, iOS, Android
- **Conexión**: Funciona completamente offline después de la primera carga

## 🐛 Solución de Problemas

### Problemas Comunes

1. **No puedo iniciar sesión**:
   - Verifica que el email y contraseña sean correctos
   - Asegúrate de haber registrado la cuenta primero
   - Limpia la caché del navegador si es necesario

2. **Perdí mis datos**:
   - Los datos se almacenan en localStorage del navegador
   - Si limpias los datos del navegador, se perderán
   - Usa siempre el mismo navegador y dispositivo

3. **La aplicación no carga**:
   - Verifica que todos los archivos estén en el servidor
   - Asegúrate de que `index.html` esté en la raíz
   - Revisa la consola del navegador (F12) para errores

4. **Problemas de visualización**:
   - Limpia caché del navegador (Ctrl+F5)
   - Verifica que el CSS se esté cargando correctamente
   - Prueba en modo incógnito

### Respaldo de Datos

Para hacer respaldo manual de tus datos:

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Application" > "Local Storage"
3. Busca las claves que empiecen con "shopperApp_"
4. Copia los valores y guárdalos en un archivo de texto

Para restaurar:
1. Pega los valores de vuelta en localStorage
2. Recarga la página

## 📈 Próximas Mejoras

- [ ] Exportar datos a Excel/PDF
- [ ] Importar/exportar configuración
- [ ] Gráficos y estadísticas avanzadas
- [ ] Modo oscuro
- [ ] Calculadora de impuestos
- [ ] Metas y objetivos mensuales
- [ ] Notificaciones de recordatorio

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Puedes usarlo libremente para proyectos personales y comerciales.

## 📞 Soporte

Para soporte técnico o preguntas:
- Crear un issue en GitHub
- Revisar la documentación en este README
- Verificar la consola del navegador para errores

---

**¡Hecho con ❤️ para la comunidad shopper!**

### Ventajas de esta versión:
- ✅ **Sin dependencias externas**: No necesita Firebase ni internet
- ✅ **Hosting gratuito**: Funciona en GitHub Pages, Netlify, etc.
- ✅ **Datos privados**: Todo se almacena localmente
- ✅ **Rápido**: Sin latencia de red
- ✅ **Offline**: Funciona sin conexión después de cargar
- ✅ **Simple**: Fácil de desplegar y mantener