<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Seller CMS - Lekit</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="shortcut icon" href="{{ asset('build/images/CMS_icon2.png') }}">
    @viteReactRefresh
    @vite(['resources/scss/theme.scss', 'resources/js/apps/seller/main.jsx'])
</head>
<body>
    <div id="react-app"></div>
</body>
</html>
