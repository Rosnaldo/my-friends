### generate mkcert on windows
mkcert nanithefuck.local

### search local certificate root
mkcert -CAROOT

### example: C:\Users\AndreyTsuzuki\AppData\Local\mkcert

### add domain on host
notepad C:\Windows\System32\drivers\etc\hosts
127.0.0.1 nanithefuck.local

### cp certs to apps/nginx/certs

Copy-Item "C:\Users\AndreyTsuzuki\AppData\Local\mkcert\nanithefuck.com.br*.pem" `
    -Destination "\\wsl.localhost\Ubuntu\home\andreytsuzuki\projects\nanithefuck" `
    -Force
