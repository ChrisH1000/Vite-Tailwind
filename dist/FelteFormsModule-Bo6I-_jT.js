import{B as i,c as b,a as u,b as x,v as S,d as q,x as c,e as v}from"./vendor-C1eCH035.js";const g={server:{host:"localhost",port:3333},log:function(){}};class A{init(o=null){let s=document.querySelectorAll(".accordion");o!==null&&(s=o.querySelectorAll(".accordion")),s.forEach((n,d)=>{let e;typeof n.dataset.strict<"u"&&(e=n.dataset.strict==="true"),n.querySelectorAll(".accordion-title").forEach((t,L)=>{t.addEventListener("click",function(){const m=t.nextElementSibling,p=t.getAttribute("aria-expanded");if(e){const y=t.classList.contains("accordion-title-open");a(n),y||(m.classList.toggle("accordion-body-open"),t.classList.toggle("accordion-title-open"),t.setAttribute("aria-expanded",p==="true"?"false":"true"))}else m.classList.toggle("accordion-body-open"),t.classList.toggle("accordion-title-open"),t.setAttribute("aria-expanded",p==="true"?"false":"true")})})});function a(n){n.querySelectorAll(".accordion-item").forEach(e=>{const l=e.querySelector(".accordion-title"),t=e.querySelector(".accordion-body");l.classList.remove("accordion-title-open"),t.classList.remove("accordion-body-open")})}}}const T=r=>{i(f(),document.querySelector("felte-validation-message"));let o=!1;const s=b().shape({name:u().required("Must have a name"),password:u().required("Must have a password"),second:x(e=>e!==void 0?u().required("Must have a second"):v().notRequired())}),a=r;a.configuration={onSubmit:e=>{const l=document.getElementById("submitted");l.innerHTML=`
        <h2 class="text-xl font-bold">Submitted:</h2>
        <pre>${JSON.stringify(e,null,2)}</pre>
      `},extend:[S({schema:s}),q]};const n=document.querySelector("form"),d=document.getElementById("submitted");n.addEventListener("reset",function(){d.innerHTML=""}),setTimeout(()=>{i(h("name",o),r.querySelector("#holder"))},"1000"),document.querySelector("#second").onclick=e=>{o=!o,i(h("name",o),r.querySelector("#holder"))},a.onDataChange=()=>{g.log("Form data = ",a.data)},a.onErrorsChange=()=>{const e=[];Object.entries(a.errors).forEach(([l,t])=>{t&&e.push(t)}),e.length>0?i(E(e),r.querySelector(".errors")):i("",r.querySelector(".errors"))},a.onIsDirtyChange=()=>{g.log(a.isDirty)}},f=()=>c`
    <template>
      <ul aria-live="polite">
        <li data-part="item"></li>
      </ul>
    </template>
  `,h=(r,o)=>{const s=()=>o?c`
        <label class="block text-gray-700 text-sm font-bold mb-2" for="second">Second</label>
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="second" required />
        <felte-validation-message for="second">
          ${f()}
          <!-- The template for the validation message -->
        </felte-validation-message>
      `:"";return c`
    <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Name</label>
    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="${r}" required />
    <felte-validation-message for="${r}">
      ${f()}
      <!-- The template for the validation message -->
    </felte-validation-message>
    ${s()}
  `},E=r=>{const o=[];return r.forEach(s=>{o.push(c`<p>${s}</p>`)}),c`
    <h2 class="text-xl font-bold">Errors</h2>

    <!-- Render the lit-html templates for the errors. -->
    ${o}
  `};export{A,T as i};
