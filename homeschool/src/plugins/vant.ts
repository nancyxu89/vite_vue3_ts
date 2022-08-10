import {
  Tabbar,
  TabbarItem,
  PullRefresh,
  List,
  Cell,
  CellGroup,
  Form,
  Field,
  Button,
  Uploader,
  NavBar,
  Col,
  Row,
  Image,
  ImagePreview,
  Loading,
  Overlay,
  Divider,
  Toast,
  ShareSheet,
  Dialog,
  Collapse,
  CollapseItem,
  Lazyload,
  RadioGroup,
  Radio,
  Badge,
} from 'vant'

const pluginsVant = [
    Tabbar,
    TabbarItem,
    PullRefresh,
    List,
    Cell,
    CellGroup,
    Form,
    Field,
    Button,
    Uploader,
    NavBar,
    Col,
    Row,
    Image,
    Loading,
    Overlay,
    Divider,
    ShareSheet,
    Collapse,
    CollapseItem,
    RadioGroup,
    Radio,
    Badge
]
const other = [
  ImagePreview,
  Toast,
  Dialog,
  Lazyload
]
export const vantPlugins = {
  	install: function(vm: any) {
    	pluginsVant.forEach((item: any) => {
      	vm.component(item.name, item)
    	})
      vm.use(Dialog)
      vm.use(Toast)
      vm.use(Lazyload, {
        lazyComponent: true,
      })
      vm.use(ImagePreview)
  	}
}