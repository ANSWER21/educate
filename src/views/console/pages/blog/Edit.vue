<template>
  <el-container style="height: 100%; display: flex; flex-direction: column;">
    <div class="blog-main">
      <div style="height: 100%;background: white; min-width: 180px">
        <el-row>
          <img src="@/assets/images/create_blogTOC.png" @click="showTocTitleDialog(null)" width="25" height="25"/>
          <img src="@/assets/images/create_blog.png" @click="showBlogTitleDialog(null)" width="25" height="25"/>
        </el-row>
        <el-tree
            style="max-width: 300px"
            :props="props"
            :load="loadNode"
            :data="toc"
            @node-click="handleNodeClick"
            @node-contextmenu="handleNodeMenu"
            node-key="id"
            lazy
        />
      </div>
      <context-menu :menu-items="menuItems" ref="contextMenuRef"/>
      <tip-tap :blog-value="optionBlog" style="flex: 1; overflow-y: auto;"/>
      <!-- 目录创建弹窗 -->
      <el-dialog v-model="tocDialogVisible" title="创建目录" width="40%">
        <el-form :model="newToc" label-width="100px">
          <el-form-item label="新邮箱">
            <el-input v-model="newToc.title" placeholder="请输入目录名称"/>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="closeTocTitleDialog">取消</el-button>
          <el-button type="primary" @click="createFolder">保存</el-button>
        </template>
      </el-dialog>
      <!-- 博客创建弹窗 -->
      <el-dialog v-model="blogDialogVisible" title="创建博客" width="40%">
        <el-input v-model="newBlogTitle" placeholder="请输入博客名称"/>
        <template #footer>
          <el-button @click="closeBlogTitleDialog">取消</el-button>
          <el-button type="primary" @click="handleCreateBlog">保存</el-button>
        </template>
      </el-dialog>
    </div>
  </el-container>
</template>

<script setup lang="ts">
import TipTap from "@/components/Edit/TipTap.vue";
import {Blog, BlogTOC, TYPE_BLOG, TYPE_BLOG_TOC} from "@/models/blog.ts";
import {
  createBlog,
  createBlogTOC,
  deleteBlog,
  deleteBlogTOC,
  getBlogByFolderId,
  getBlogTocChildren
} from "@/api/models/blog.ts";
import {onMounted, ref} from "vue";
import {CODE_SUCCESS} from "@/models/resultJson.ts";
import {ElMessage} from "element-plus";
import ContextMenu, {ContextMenuItem} from "@/components/Menu/ContextMenu.vue";
import type Node from 'element-plus/es/components/tree/src/model/node'

const toc = ref<any[]>([])

const tocDialogVisible = ref(false)
const blogDialogVisible = ref(false)
const optionBlog = ref<Blog>()

const contextMenuRef = ref<InstanceType<typeof ContextMenu>>();
const menuItems = ref<ContextMenuItem[]>([])

const props = {
  label: 'title',
  children: 'children',
  isLeaf: (node: BlogTOC | Blog) => {
    return !node.hasChild
  }
}

let optionTOC: BlogTOC | null = null

const newToc = ref<BlogTOC>({
  id: null,
  title: '',
  createTime: new Date(),
  parentId: null,
  children: [],
  hasChild: false,
  type: TYPE_BLOG_TOC
})

const newBlogTitle = ref<string>('')

const createFolder = () => {
  console.log('创建文件夹')
  newToc.value.createTime = new Date()
  newToc.value.parentId = optionTOC?.id ?? null
  createBlogTOC(newToc.value).then((res) => {
    if (res.code === CODE_SUCCESS) {
      if (optionTOC === null) {
        toc.value.push(res.data)
      } else {
        optionTOC.children.push(res.data)
      }
    } else {
      console.log(`创建文件夹失败:${res.msg}`)
    }
  }).catch((error) => {
    ElMessage.error(error.message)
  }).finally(() => {
    tocDialogVisible.value = false
  })
}

const loadNode = async (node: Node | null, resolve: (data: any[]) => void) => {
  try {
    const blogTOC = node?.data as BlogTOC | null;
    console.log(`查询:${blogTOC?.id}的子目录`)
    const tocResponse = await getBlogTocChildren(blogTOC?.id ?? null);
    if (tocResponse.code !== CODE_SUCCESS) {
      ElMessage.error(`获取目录失败:${tocResponse.msg}`)
      return;
    }

    const tocs: BlogTOC[] = tocResponse.data;

    const blogResponse = await getBlogByFolderId(blogTOC?.id ?? null);
    if (blogResponse.code !== CODE_SUCCESS) {
      ElMessage.error(`获取博客失败:${blogResponse.msg}`)
      return;
    }

    const blogs: Blog[] = blogResponse.data;
    console.log(`获取到目录${tocs.length},博客${blogs.length}`)
    resolve([...tocs, ...blogs]);
  } catch (error) {
    ElMessage.error('请求失败')
  }
};

const handleNodeClick = (node: BlogTOC | Blog) => {
  if (node.type === TYPE_BLOG) {
    optionBlog.value = node as Blog
  }
}

const handleNodeMenu = (event: MouseEvent, data: BlogTOC | Blog) => {
  event.preventDefault(); // 阻止默认的右键菜单
  if (data.type === TYPE_BLOG_TOC) {
    menuItems.value = [
      {
        name: '新建文件夹',
        action: () => {
          contextMenuRef.value?.closeMenu()
          showTocTitleDialog(data as BlogTOC)
        },
      },
      {
        name: '新建笔记',
        action: () => {
          contextMenuRef.value?.closeMenu()
          showBlogTitleDialog(data as BlogTOC)
        },
      },
      {
        name: '删除',
        action: () => {
          contextMenuRef.value?.closeMenu()
          removeBlogTOC(data as BlogTOC)
        },
      },
    ]
  } else {
    menuItems.value = [
      {
        name: '删除',
        action: () => {
          contextMenuRef.value?.closeMenu()
          removeBlog(data as Blog)
        },
      },
    ]
  }
  contextMenuRef.value?.openMenu(event, data)
}

const removeBlogTOC = (optionToc: BlogTOC) => {
  deleteBlogTOC(optionToc.id!!).then((res) => {
    if (res.code == CODE_SUCCESS) {
      const removeNode = (nodes: any[], id: number): any[] => {
        return nodes.reduce((acc: any[], node: BlogTOC | Blog) => {
          if (node.type == TYPE_BLOG_TOC && node.id === id) {
            return acc;
          }

          if (node.type == TYPE_BLOG_TOC && node.children && node.children.length > 0) {
            node.children = removeNode(node.children, id);
          }

          acc.push(node);
          return acc;
        }, []);
      };

      toc.value = removeNode(toc.value, optionToc.id!!);
    }
  }).catch((error) => {
    ElMessage.error(error.message);
  });
};


const removeBlog = (blog: Blog) => {
  deleteBlog(blog.id!!).then((res) => {
    if (res.code == CODE_SUCCESS) {
      const removeNode = (nodes: any[], id: number): any[] => {
        return nodes.reduce((acc: any[], node: BlogTOC | Blog) => {
          console.log(node.type + node.id)
          if (node.type == TYPE_BLOG && node.id === id) {
            return acc;
          }

          if (node.type == TYPE_BLOG_TOC && node.children && node.children.length > 0) {
            node.children = removeNode(node.children, id);
          }

          acc.push(node);
          return acc;
        }, []);
      };

      toc.value = removeNode(toc.value, blog.id!!);
    } else {
      ElMessage.error(`删除出错${res.msg}`);
    }
  }).catch((error) => {
    ElMessage.error(error.message);
  });
};

const showTocTitleDialog = (toc: BlogTOC | null) => {
  optionTOC = toc
  newToc.value.title = ''
  tocDialogVisible.value = true
}

const closeTocTitleDialog = () => {
  tocDialogVisible.value = false
}

const handleCreateBlog = () => {
  if (newBlogTitle.value === '') {
    ElMessage.error('请输入博客名称')
    return
  }
  createBlog(newBlogTitle.value, optionTOC?.id ?? null).then((res) => {
    if (res.code === CODE_SUCCESS) {
      if (optionTOC === null) {
        toc.value.push(res.data)
      } else {
        optionTOC.children.push(res.data)
      }
      closeBlogTitleDialog()
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const showBlogTitleDialog = (toc: BlogTOC | null) => {
  optionTOC = toc
  newBlogTitle.value = ''
  blogDialogVisible.value = true
}

const closeBlogTitleDialog = () => {
  blogDialogVisible.value = false
}

onMounted(() => {
  loadNode(null, (data) => {
    console.log(data)
    toc.value = data;
  });
});
</script>

<style scoped lang="scss">
.blog-main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  background: #66b1ff;
}
</style>