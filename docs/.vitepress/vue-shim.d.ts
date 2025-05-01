/**
 *  Copyright (c) 2025 taskylizard. Apache License 2.0.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
declare const __VP_HASH_MAP__: Record<string, string>
declare const __VP_LOCAL_SEARCH__: boolean
declare const __ALGOLIA__: boolean
declare const __CARBON__: boolean
declare const __VUE_PROD_DEVTOOLS__: boolean
declare const __ASSETS_DIR__: string

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

declare module '@siteData' {
  import type { SiteData } from 'vitepress'
  const data: SiteData
  export default data
}

declare module '@theme/index' {
  import type { Theme } from 'vitepress'
  const theme: Theme
  export default theme
}

declare module '@localSearchIndex' {
  const data: Record<string, () => Promise<{ default: string }>>
  export default data
}

declare module 'mark.js/src/vanilla.js' {
  import type Mark from 'mark.js'
  const mark: typeof Mark
  export default mark
}
