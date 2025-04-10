import { build, emptyDir } from "jsr:@deno/dnt";

await emptyDir("./npm");

await build({
  entryPoints: ["./src/mod.ts"],
  outDir: "./npm",
  shims: {
    deno: true,
  },
  package: {
    // package.json properties
    name: Deno.args[0],
    version: Deno.args[1],
    description: "Deterministic Mnemonic Sentences from Identity Documents.",
    license: "MIT",
    homepage: "https://github.com/jacobhaap/ts-id-bound-acct#readme",
    repository: {
      type: "git",
      url: "git+https://gitlab.com/jacobhaap/ts-id-bound-acct.git",
    },
    bugs: {
      url: "https://github.com/jacobhaap/ts-id-bound-acct/issues",
    },
    author: {
        name: "Jacob V. B. Haap",
        url: "https://iacobus.xyz/"
    },
    keywords: [
        "identity",
        "deterministic",
        "wallet",
        "mnemonic",
        "bip39"
    ]
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
