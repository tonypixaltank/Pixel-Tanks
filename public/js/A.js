class A {
  static templates = {};
  static createTemplate(n, v, r, p) {
    A.templates[n] = [v, r];
    A[n] = [];
    for (let i = 0; i < p; i++) A.template(n);
  }
  static template(n) {
    if (!A[n].length) {
      let e = new A.classTemplates[n]();
      e.release = () => {
        if (!A.templates[n][1]) A.templates[n][1](e); else e.reset();
        A[n].push(e);
      };
      return e;
    } else return A[n].shift();
  }
}
