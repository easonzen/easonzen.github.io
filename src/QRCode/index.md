---
nav:
    title: Components
    path: /components
---

## QRCode

Demo:

```tsx
import React from 'react';
import { QRCode } from 'zen-lib';

export default () => <QRCode onSuccess={url => (window.location.href = url)} onFail={errorMsg => alert(errorMsg)} />;
```

More skills for writing demo: https://d.umijs.org/guide/demo-principle
