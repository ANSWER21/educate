import {mergeAttributes, Node} from '@tiptap/core'
import {VueNodeViewRenderer} from '@tiptap/vue-3'

import Component from '@/components/Edit/extensions/DragItem.vue'

const DraggableItem = Node.create({
    name: 'draggableItem',

    group: 'block',

    content: 'block+',

    draggable: true,

    parseHTML() {
        return [
            {
                tag: 'div[data-type="draggable-item"]',
            },
        ]
    },

    renderHTML({HTMLAttributes}) {
        return ['div', mergeAttributes(HTMLAttributes, {'data-type': 'draggable-item'}), 0]
    },

    addNodeView() {
        return VueNodeViewRenderer(Component)
    },
})

export default DraggableItem;