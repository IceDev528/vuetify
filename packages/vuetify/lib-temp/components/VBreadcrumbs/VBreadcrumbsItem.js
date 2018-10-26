import Routable from '../../mixins/routable';
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Routable).extend({
    name: 'v-breadcrumbs-item',
    props: {
        // In a breadcrumb, the currently
        // active item should be dimmed
        activeClass: {
            type: String,
            default: 'v-breadcrumbs__item--disabled'
        }
    },
    computed: {
        classes() {
            return {
                'v-breadcrumbs__item': true,
                [this.activeClass]: this.disabled
            };
        }
    },
    render(h) {
        const { tag, data } = this.generateRouteLink(this.classes);
        return h('li', [
            h(tag, data, this.$slots.default)
        ]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkJyZWFkY3J1bWJzSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZCcmVhZGNydW1icy9WQnJlYWRjcnVtYnNJdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sUUFBUSxNQUFNLHVCQUF1QixDQUFBO0FBRTVDLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBR3RDLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDckMsSUFBSSxFQUFFLG9CQUFvQjtJQUUxQixLQUFLLEVBQUU7UUFDTCxpQ0FBaUM7UUFDakMsK0JBQStCO1FBQy9CLFdBQVcsRUFBRTtZQUNYLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLCtCQUErQjtTQUN6QztLQUNGO0lBRUQsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wscUJBQXFCLEVBQUUsSUFBSTtnQkFDM0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVE7YUFDbEMsQ0FBQTtRQUNILENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBRSxDQUFDO1FBQ1AsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRTFELE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRTtZQUNiLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1NBQ2xDLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUm91dGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3JvdXRhYmxlJ1xuXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoUm91dGFibGUpLmV4dGVuZCh7XG4gIG5hbWU6ICd2LWJyZWFkY3J1bWJzLWl0ZW0nLFxuXG4gIHByb3BzOiB7XG4gICAgLy8gSW4gYSBicmVhZGNydW1iLCB0aGUgY3VycmVudGx5XG4gICAgLy8gYWN0aXZlIGl0ZW0gc2hvdWxkIGJlIGRpbW1lZFxuICAgIGFjdGl2ZUNsYXNzOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAndi1icmVhZGNydW1ic19faXRlbS0tZGlzYWJsZWQnXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd2LWJyZWFkY3J1bWJzX19pdGVtJzogdHJ1ZSxcbiAgICAgICAgW3RoaXMuYWN0aXZlQ2xhc3NdOiB0aGlzLmRpc2FibGVkXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcbiAgICBjb25zdCB7IHRhZywgZGF0YSB9ID0gdGhpcy5nZW5lcmF0ZVJvdXRlTGluayh0aGlzLmNsYXNzZXMpXG5cbiAgICByZXR1cm4gaCgnbGknLCBbXG4gICAgICBoKHRhZywgZGF0YSwgdGhpcy4kc2xvdHMuZGVmYXVsdClcbiAgICBdKVxuICB9XG59KVxuIl19