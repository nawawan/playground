---
paths:
  - "**/*.tsx"
---

# frontend 開発ルール

- 全てのfrontend componentはUIに責務を持つpresentation層とロジックに責務を持つcontainer層に分ける。
- componentsはfunctionで定義するのではなく、const hoge = () => {}の形式で実装する。
- presentation層はUIを記載したファイルをhoge.tsxとして、それをstorybookで表示するためのhoge.stories.tsxを作成する。
- presentation層にはcontainer層から注入するためのpropsの型を明確に定義する。
- container層はUI層で定義したpropsを作成するuseGenerateProps.tsxと、それを用いて実際にUIに注入を行うContainer.tsxを作成する。

