<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Driver App - Lekit</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="app-route-prefix" content="{{ config('app.route_prefix', '') }}">
    <link rel="shortcut icon" href="{{ asset('build/images/CMS_icon2.png') }}">
    @viteReactRefresh
    @vite(['resources/scss/theme.scss', 'resources/js/apps/driver/main.jsx'])
</head>
<body>
    <div id="react-app"></div>
</body>
</html>
