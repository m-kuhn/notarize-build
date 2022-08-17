# GitHub Action to upload to Apple's notarization service

## Usage:

```yaml
- name: 'Notarize app'
  uses: m-kuhn/notarize-build@v1
  with: 
    app-path: 'path/to/application.dmg' 
    issuer-id: ${{ secrets.APPSTORE_ISSUER_ID }}
    api-key-id: ${{ secrets.APPSTORE_API_KEY_ID }}
    api-private-key: ${{ secrets.APPSTORE_API_PRIVATE_KEY }}
    primary-bundle-id: 'org.acme.id'
```

## Additional Arguments

See [action.yml](action.yml) for more details.
