# Maven Toolchains and CI integration

This folder documents how the repository provides a `toolchains.xml` and how CI can pick it up.

- Repository toolchains file: `.github/maven/toolchains.xml` — requests JDK 21 (vendor: `eclipse-temurin`).
- `pom.xml` was updated to configure `maven-toolchains-plugin` (version 3.1.0) and to point the plugin at `${project.basedir}/.github/maven/toolchains.xml` via the `toolchainsFile` configuration.

How CI picks up the toolchain

1. GitHub Actions runners typically provide multiple JDKs. To ensure the build uses Temurin JDK 21, workflows should:
   - Use `actions/setup-java` with `java-version: '21'` and `distribution: 'temurin'`.
   - Optionally, keep the toolchains file in the repository so local developer builds and the `maven-toolchains-plugin` can detect the desired JDK via the `toolchainsFile` setting.

2. The `maven-toolchains-plugin` reads the file configured in `toolchainsFile` and selects the matching JDK. If the runner's installed JDK matches vendor/version, Maven will use it. If not found, the plugin logs a warning and Maven continues with the default `JAVA_HOME`.

Notes & Safety

- We intentionally used a repository-scoped `toolchains.xml` (under `.github/maven`) to avoid requiring changes to developer `~/.m2`.
- Some CI setups don't allow selecting JDK vendor by name; using `actions/setup-java` ensures the runner has the expected Temurin 21 available.
