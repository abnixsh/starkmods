< !doctype html >
    <
    html lang = "en" >
    <
    head >
    <
    meta charset = "utf-8" / >
    <
    meta name = "viewport"
content = "width=device-width,initial-scale=1" / >
    <
    meta name = "description"
content = "Aadil Menus - Professional modding tools for testing and development. Reliable, simple, and ready to use." / >
    <
    meta name = "keywords"
content = "Aadil Menus, Aadil Mods, Gamer Aadil, Offset Tester, Chams Menu, ESP Tester, Android, mod menus, apps" / >
    <
    meta property = "og:title"
content = "Aadil Menus" / >
    <
    meta property = "og:description"
content = "Professional modding tools for testing and development. Reliable, simple, and ready to use." / >
    <
    meta property = "og:type"
content = "website" / >
    <
    meta name = "twitter:card"
content = "summary_large_image" / >
    <
    link rel = "icon"
href = "assets/icons/favicon.ico"
type = "image/x-icon" >
    <
    link rel = "icon"
href = "assets/icons/favicon.svg"
type = "image/svg+xml" >


    <!-- Tailwind (CDN) -->
    <
    script src = "https://cdn.tailwindcss.com" > < /script>
    <!-- Material Icons -->
    <
    link href = "https://fonts.googleapis.com/icon?family=Material+Icons"
rel = "stylesheet" >

    <!-- External CSS -->
    <
    link rel = "stylesheet"
href = "css/styles.css" / >

    <
    title > Aadil Menus < /title> <
    /head> <
    body class = "bg-white text-slate-800 antialiased" >

    <!-- Header (Fixed Layout) -->
    <
    header class = "bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800" >
    <
    div class = "max-w-6xl mx-auto px-4 sm:px-6" >
    <
    div class = "flex items-center justify-between h-16" >
    <
    div class = "flex items-center gap-3" >
    <
    button id = "mobile-menu-button"
class = "md:hidden p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" >
    <
    span class = "material-icons" > menu < /span> <
    /button> <
    a href = "/"
class = "flex items-center gap-3"
data - link >
    <
    img src = "assets/icons/icon_site.jpg"
alt = "Aadil Menus"
class = "h-10 w-10 rounded-lg"
loading = "lazy" / >
    <
    div >
    <
    div class = "text-lg font-semibold" > Aadil Menus < /div> <
    div class = "text-xs text-slate-500 dark:text-slate-400 -mt-1" > Professional Modding Tools < /div> <
    /div> <
    /a> <
    /div>

    <
    nav id = "desktop-nav"
class = "hidden md:flex items-center gap-6" >
    <
    a href = "/"
class = "nav-link"
data - link > Home < /a> <
    a href = "/plans"
class = "nav-link"
data - link > Plans < /a> <
    a href = "/contact"
class = "nav-link"
data - link > Contact < /a> <
    a href = "/help"
class = "nav-link"
data - link > Help < /a>

    <!-- More dropdown -->
    <
    div class = "relative dropdown-container" >
    <
    button id = "more-dropdown"
class = "nav-link flex items-center gap-1" >
    More < span class = "material-icons text-sm" > keyboard_arrow_down < /span> <
    /button> <
    div id = "more-menu"
class = "hidden absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50" >
    <
    a href = "/about"
class = "block px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
data - link > About < /a> <
    a href = "/privacy"
class = "block px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
data - link > Privacy Policy < /a> <
    a href = "/terms"
class = "block px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
data - link > Terms & Conditions < /a> <
    /div> <
    /div>

    <
    button id = "theme-toggle"
class = "flex items-center gap-2 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" >
    <
    span id = "theme-icon"
class = "material-icons" > dark_mode < /span> <
    span id = "theme-text"
class = "text-sm" > Dark < /span> <
    /button> <
    /nav> <
    /div> <
    /div>

    <!-- Mobile menu (hidden by default) -->
    <
    div id = "mobile-menu"
class = "md:hidden hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" >
    <
    div class = "px-4 py-3 space-y-2" >
    <
    a href = "/"
class = "block mobile-link"
data - link > Home < /a> <
    a href = "/plans"
class = "block mobile-link"
data - link > Plans < /a> <
    a href = "/contact"
class = "block mobile-link"
data - link > Contact < /a> <
    a href = "/help"
class = "block mobile-link"
data - link > Help < /a> <
    div class = "border-t border-slate-200 dark:border-slate-700 pt-2 mt-2" >
    <
    div class = "text-xs font-semibold text-slate-500 dark:text-slate-400 px-2 mb-2" > MORE < /div> <
    a href = "/about"
class = "block mobile-link pl-4"
data - link > About < /a> <
    a href = "/privacy"
class = "block mobile-link pl-4"
data - link > Privacy Policy < /a> <
    a href = "/terms"
class = "block mobile-link pl-4"
data - link > Terms & Conditions < /a> <
    /div> <
    button id = "theme-toggle-mobile"
class = "w-full text-left flex items-center gap-2 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" >
    <
    span id = "theme-icon-mobile"
class = "material-icons" > dark_mode < /span> <
    span id = "theme-text-mobile" > Dark < /span> <
    /button> <
    /div> <
    /div> <
    /header>

    <!-- Main Content Area (Dynamic) -->
    <
    main id = "app-content"
class = "max-w-6xl mx-auto px-4 sm:px-6 py-10" >
    <!-- Content will be loaded here dynamically -->
    <
    /main>

    <!-- Footer (Fixed Layout) -->
    <
    footer class = "mt-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" >
    <
    div class = "max-w-6xl mx-auto px-4 sm:px-6 py-8" >
    <
    div class = "flex flex-col md:flex-row items-center justify-between" >
    <
    div class = "flex items-center gap-3" >
    <
    img src = "assets/icons/icon_site.jpg"
alt = "Aadil Menus"
class = "h-10 w-10 rounded-lg"
loading = "lazy" / >
    <
    div >
    <
    div class = "font-semibold" > Aadil Menus < /div> <
    div class = "text-sm text-slate-500 dark:text-slate-400" > Modding Tools & Testers < /div> <
    /div> <
    /div> <
    div class = "text-sm text-slate-500 dark:text-slate-400 mt-4 md:mt-0" > & copy;
2025 Aadil Menus.All rights reserved. < /div> <
    /div> <
    /div> <
    /footer>

    <!-- Loading Indicator -->
    <
    div id = "loading-indicator"
class = "fixed top-0 left-0 w-full h-1 bg-blue-600 opacity-0 transition-opacity duration-300 z-50" >
    <
    div class = "h-full bg-blue-400 animate-pulse" > < /div> <
    /div>

    <!-- External JavaScript -->
    <
    script src = "js/app.js" > < /script> <
    script src = "js/components.js" > < /script> <
    script src = "js/router.js" > < /script>

    <
    /body> <
    /html>