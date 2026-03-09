<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin CMS - Lekit</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="shortcut icon" href="{{ URL::asset('resources/CMS_icon2.png') }}">
    @viteReactRefresh
    @vite(['resources/scss/theme.scss', 'resources/js/apps/admin/main.jsx'])
</head>
<body>
    <div id="react-app"></div>
</body>
</html>
